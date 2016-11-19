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
      if (!this.params.node.expanded) {
        setTimeout(() => {
          console.log('expanding group ' + this.params.data.group);
          this.params.node.expanded = true;
          console.log('firing "modelUpdated" for group ' + this.params.data.group);
          this.params.api.dispatchEvent('modelUpdated', {
            group: this.params.data.group,
            expanded: this.params.node.expanded
          });
        }, 3000);
      }
      this.valueElement.innerHTML = '<b>Group ' + this.params.data.group + '</b>';
    }
  }
}
