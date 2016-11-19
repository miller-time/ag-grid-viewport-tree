import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid/main';

import { GridService, RowData } from './grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  private gridOptions: GridOptions;

  constructor(
    private gridService: GridService
  ) {
    this.gridOptions = {
      enableColResize: true,
      columnDefs: [
        { field: 'mean',   headerName: 'Mean',   width: 200 },
        { field: 'median', headerName: 'Median', width: 200 },
        { field: 'mode',   headerName: 'Mode',   width: 200 },
        { field: 'range',  headerName: 'Range',  width: 200 },
      ]
    };
  }

  ngOnInit() {
    this.gridService.getData()
      .subscribe((rowData: RowData[]) => {
        this.gridOptions.api.setRowData(rowData);
      });
  }
}
