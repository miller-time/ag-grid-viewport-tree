import { Component } from '@angular/core';

import { GridApi, GridOptions, IViewportDatasourceParams } from 'ag-grid/main';
import 'ag-grid-enterprise';

import { Subject } from 'rxjs';

import { GridService, GridData } from './grid.service';
import { ViewportDatasource } from './viewport-datasource';
import { TreeNodeCellRenderer, ExpandGroupEvent } from './tree-node-cell-renderer';

type CollapsedGroups = { [key: string]: boolean };

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  private gridApi: GridApi;
  private gridOptions: GridOptions;
  private viewportParams: IViewportDatasourceParams;
  private viewportRange = {firstRow: 0, lastRow: 0};
  private viewportChange = new Subject<{firstRow: number, lastRow: number}>();
  private collapsedGroups: CollapsedGroups = {};
  private groupToggle = new Subject<ExpandGroupEvent>();

  constructor(
    private gridService: GridService
  ) {
    this.gridOptions = {
      enableColResize: true,
      rowModelType: 'viewport',
      columnDefs: [
        { headerName: 'Group', cellRenderer: TreeNodeCellRenderer },
        { field: 'mean',   headerName: 'Mean',   width: 200 },
        { field: 'median', headerName: 'Median', width: 200 },
        { field: 'mode',   headerName: 'Mode',   width: 200 },
        { field: 'range',  headerName: 'Range',  width: 200 },
      ],
      onGridReady: (event) => {
        this.gridApi = event.api;
        let datasource = new ViewportDatasource({
          viewportReady: (params: IViewportDatasourceParams) => {
            this.viewportParams = params;
            this.viewportChange.next({firstRow: 0, lastRow: 0});
          },
          viewportRangeChanged: (firstRow: number, lastRow: number) => {
            this.viewportChange.next({firstRow, lastRow});
          }
        });
        this.subscribeForViewportChanges();
        this.subscribeForGroupToggles();
        this.gridApi.setViewportDatasource(datasource);
      },
      onRowGroupOpened: (event: ExpandGroupEvent) => {
        console.log('row group toggled', event);
        this.groupToggle.next(event);
      }
    };
  }

  private subscribeForViewportChanges() {
    this.viewportChange
      .debounceTime(200)
      .distinctUntilChanged((a, b) => {
          return a.firstRow === b.firstRow && a.lastRow === b.lastRow;
      })
      .switchMap((range) => {
        console.log('viewport range:', range.firstRow, range.lastRow);
        this.viewportRange.firstRow = range.firstRow;
        this.viewportRange.lastRow = range.lastRow;
        return this.updateGrid();
      })
      .subscribe();
  }

  private subscribeForGroupToggles() {
    this.groupToggle
      .subscribe((toggle: ExpandGroupEvent) => {
        this.collapsedGroups[toggle.group] = !toggle.expanded;
        this.updateGrid()
          .subscribe();
      });
  }

  private updateGrid() {
    return this.gridService.getData(
      this.viewportRange.firstRow,
      this.viewportRange.lastRow,
      this.collapsedGroups
    ).map((gridData: GridData) => {
        this.viewportParams.setRowCount(gridData.rowCount);
        console.log('fetched ' + gridData.rowCount + ' rows of data');
        this.viewportParams.setRowData(gridData.rowDataMap);
        console.log('setting row data', gridData.rowDataMap);
    });
  }
}
