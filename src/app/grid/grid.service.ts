import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

export interface RowData {
  mean: number;
  median: number;
  mode: number;
  range: number;
}

@Injectable()
export class GridService {
  constructor(private http: Http) { }

  getData(): Observable<RowData[]> {
    return this.http.get('/app/dataset')
      .map((res: Response) => res.json().data);
  }
}
