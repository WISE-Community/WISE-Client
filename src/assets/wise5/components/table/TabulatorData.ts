export class TabulatorData {
  constructor(
    public columns: TabulatorColumn[] = [], // see http://tabulator.info/docs/5.3/columns
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

export class TabulatorColumn {
  title: string;
  field: string;
  width: number | string; // number of pixels or percent of table width (e.g. '20%')

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}