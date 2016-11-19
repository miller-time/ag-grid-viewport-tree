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

  getData(firstRow: number, lastRow: number, collapsedGroups: { [key: string]: boolean }): Observable<GridData> {
    return this.http.get('/app/dataset')
      .map((res: Response) => {
        let rowData: RowData[] = res.json().data;
        return this.convertToRowDataMap(rowData, firstRow, lastRow, collapsedGroups);
      });
  }

  private convertToRowDataMap(
    rowData: RowData[],
    firstRow: number,
    lastRow: number,
    collapsedGroups: { [key: string]: boolean }
  ) {
    let treeRowMap: { [key: number]: RowData } = {};
    let treeCurrentRow = 0;
    // @TODO: building the tree map should be recursive, and probably
    //  also want to set "level" or something on the row while walking the tree
    rowData.forEach((row: RowData) => {
      // @TODO: remove `children` from group rows before sending to grid
      // (the grid doesn't actually need the children to exist on a group node
      //  because each child row is just a row)
      treeRowMap[treeCurrentRow] = row;
      treeCurrentRow += 1;
      if (row.children && !collapsedGroups[row.group.toString()]) {
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
