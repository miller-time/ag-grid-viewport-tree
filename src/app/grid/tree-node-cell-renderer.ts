import { ColDef, GridApi, ICellRenderer, RowNode } from 'ag-grid/main';

interface CellRendererParams {
  value: any;
  node: RowNode;
  data: any;
  colDef: ColDef;
  api: GridApi;
}

export class TreeNodeCellRenderer implements ICellRenderer {
  private params: CellRendererParams;
  private element: HTMLElement;
  private valueElement: Element;

  init(params: CellRendererParams) {
    this.params = params;

    this.createElement();
  }

  getGui() {
    return this.element;
  }

  refresh() {
    this.updateValue();
  }

  private createElement() {
    this.element = document.createElement('div');
    this.element.innerHTML = '<span class="group-value"></span>';
    this.valueElement = this.element.querySelectorAll('.group-value')[0];
    this.updateValue();
  }

  private updateValue() {
    if (this.params.data && this.params.data.group) {
      this.valueElement.innerHTML = '<b>Group ' + this.params.data.group + '</b>';
    }
  }
}
