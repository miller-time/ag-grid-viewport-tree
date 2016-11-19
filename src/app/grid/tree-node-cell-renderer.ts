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
  private toggleButton: HTMLElement;
  private expandedElement: HTMLElement;
  private collapsedElement: HTMLElement;
  private valueElement: HTMLElement;

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

  destroy() {
    this.toggleButton.removeEventListener('click', this.onExpandedOrCollapsed.bind(this));
  }

  private createElement() {
    this.element = document.createElement('div');
    this.element.innerHTML = `
      <button class="expand-collapse-btn">
        <span class="expanded fa fa-plus-square-o"></span>
        <span class="collapsed fa fa-minus-square-o"></span>
      </button>

      <span class="group-value"></span>
    `;
    this.toggleButton = <HTMLElement>this.element.querySelectorAll('button')[0];
    this.toggleButton.addEventListener('click', this.onExpandedOrCollapsed.bind(this));

    this.expandedElement = <HTMLElement>this.element.querySelectorAll('.expanded')[0];
    this.collapsedElement = <HTMLElement>this.element.querySelectorAll('.collapsed')[0];

    this.valueElement = <HTMLElement>this.element.querySelectorAll('.group-value')[0];

    this.updateValue();
  }

  private onExpandedOrCollapsed() {
    this.params.node.expanded = !this.params.node.expanded;
    this.updateValue();
  }

  private updateValue() {
    if (this.params.data && this.params.data.group) {
      if (typeof this.params.node.expanded === 'undefined') {
        this.params.node.expanded = true;
      }
      this.setVisible(this.expandedElement, this.params.node.expanded);
      this.setVisible(this.collapsedElement, !this.params.node.expanded);
      this.valueElement.innerHTML = '<b>Group ' + this.params.data.group + '</b>';
    } else {
      this.setVisible(this.toggleButton, false);
    }
  }

  private setVisible(element: HTMLElement, visible: boolean) {
    if (visible) {
      this.showElement(element);
    } else {
      this.hideElement(element);
    }
  }

  private hideElement(element: HTMLElement) {
    element.style.display = 'none';
  }

  private showElement(element: HTMLElement) {
    element.style.display = 'inline-block';
  }
}
