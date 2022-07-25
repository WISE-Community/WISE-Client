export class TabulatorData {
  constructor(
    public columns: any[] = [], // see http://tabulator.info/docs/5.3/columns
    public data: any[] = [], // see http://tabulator.info/docs/5.3/data
    public editableCells: any = {},
    public options: any = {} // see http://tabulator.info/docs/5.3/options
  ) {
    const defaultOptions = {
      layout: 'fitDataTable',
      maxHeight: '500px',
      reactiveData: true
    };
    this.options = { ...defaultOptions, ...options };
  }
}
