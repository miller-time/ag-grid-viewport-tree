import { IViewportDatasource, IViewportDatasourceParams } from 'ag-grid/main';

export interface ChangeHook {
  viewportReady: (params: IViewportDatasourceParams) => void;
  viewportRangeChanged: (firstRow: number, lastRow: number) => void;
}

export class ViewportDatasource implements IViewportDatasource {
  private params: IViewportDatasourceParams;

  constructor(
    private hook: ChangeHook
  ) { }

  init(params: IViewportDatasourceParams) {
    console.log('ViewportDatasource.init');
    this.params = params;
    this.hook.viewportReady(this.params);
  }

  setViewportRange(firstRow: number, lastRow: number) {
    console.log('ViewportDatasource.setViewportRange', firstRow, lastRow);
    this.hook.viewportRangeChanged(firstRow, lastRow);
  }
}
