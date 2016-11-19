import { Component } from '@angular/core';

import { GridApi, GridOptions, NodeChildDetails, IViewportDatasourceParams } from 'ag-grid/main';
import 'ag-grid-enterprise';

import { Subject } from 'rxjs';

import { GridService, RowData, GridData } from './grid.service';
import { ViewportDatasource } from './viewport-datasource';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  private gridApi: GridApi;
  private gridOptions: GridOptions;
  private viewportParams: IViewportDatasourceParams;
  private viewportRange = new Subject<{firstRow: number, lastRow: number}>();

  constructor(
    private gridService: GridService
  ) {
    this.gridOptions = {
      enableColResize: true,
      rowModelType: 'viewport',
      columnDefs: [
        { headerName: 'Group', cellRenderer: 'group' },
        { field: 'mean',   headerName: 'Mean',   width: 200 },
        { field: 'median', headerName: 'Median', width: 200 },
        { field: 'mode',   headerName: 'Mode',   width: 200 },
        { field: 'range',  headerName: 'Range',  width: 200 },
      ],
      getNodeChildDetails: (rowItem) => this.getNodeChildDetails(rowItem),
      onGridReady: (event) => {
        this.gridApi = event.api;
        let datasource = new ViewportDatasource({
          viewportReady: (params: IViewportDatasourceParams) => {
            this.viewportParams = params;
            this.viewportRange.next({firstRow: 0, lastRow: 0});
          },
          viewportRangeChanged: (firstRow: number, lastRow: number) => {
            this.viewportRange.next({firstRow, lastRow});
          }
        });
        this.subscribeForViewportRange();
        this.gridApi.setViewportDatasource(datasource);
      }
    };
  }

  private getNodeChildDetails(rowItem): NodeChildDetails {
    console.log('getNodeChildDetails');
    if (rowItem.group) {
      return {
        group: true,
        expanded: true,
        children: rowItem.children,
        field: 'group',
        key: 'Group ' + rowItem.group
      };
    }
  }

  private subscribeForViewportRange() {
    this.viewportRange
      .debounceTime(200)
      .distinctUntilChanged((a, b) => a.firstRow === b.firstRow && a.lastRow === b.lastRow)
      .switchMap((range) => {
        console.log('viewport range:', range.firstRow, range.lastRow);
        return this.gridService.getData(range.firstRow, range.lastRow);
      })
      .subscribe((gridData: GridData) => {
        this.viewportParams.setRowCount(gridData.rowCount);
        console.log('fetched ' + gridData.rowCount + ' rows of data');
        this.viewportParams.setRowData(gridData.rowDataMap);
        console.log('setting row data', gridData.rowDataMap);
      });
  }
}
