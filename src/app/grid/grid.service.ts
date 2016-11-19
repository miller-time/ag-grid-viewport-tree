import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

export interface RowData {
  group?: number;
  children?: RowData[];
  mean: number;
  median: number;
  mode: number;
  range: number;
}

export interface GridData {
  rowCount: number;
  firstRow: number;
  lastRow: number;
  rowDataMap: { [key: number]: RowData };
}

@Injectable()
export class GridService {
  constructor(private http: Http) { }

  getData(firstRow: number, lastRow: number): Observable<GridData> {
    return this.http.get('/app/dataset')
      .map((res: Response) => {
        let rowData: RowData[] = res.json().data;
        return this.convertToRowDataMap(rowData, firstRow, lastRow);
      });
  }

  private convertToRowDataMap(rowData: RowData[], firstRow: number, lastRow: number) {
    let treeRowMap: { [key: number]: RowData } = {};
    let treeCurrentRow = 0;
    rowData.forEach((row: RowData) => {
      treeRowMap[treeCurrentRow] = row;
      treeCurrentRow += 1;
      if (row.children) {
        row.children.forEach((childRow: RowData) => {
          treeRowMap[treeCurrentRow] = childRow;
          treeCurrentRow += 1;
        });
      }
    });

    let rowDataMap: { [key: number]: RowData } = {};
    for (let i = firstRow; i <= lastRow; ++i) {
      if (treeRowMap[i]) {
        rowDataMap[i] = treeRowMap[i];
      }
    }

    return {
      rowCount: treeCurrentRow,
      firstRow: firstRow,
      lastRow: lastRow,
      rowDataMap: rowDataMap
    };
  }
}
