import { AgGridViewportTreePage } from './app.po';

describe('ag-grid-viewport-tree App', function() {
  let page: AgGridViewportTreePage;

  beforeEach(() => {
    page = new AgGridViewportTreePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
