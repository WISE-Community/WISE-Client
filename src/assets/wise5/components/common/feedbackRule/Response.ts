export class Response {
  submitCounter: number;
  constructor(jsonObject: any = {}) {
    this.populateFields(jsonObject);
  }

  protected populateFields(jsonObject: any = {}): void {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}
