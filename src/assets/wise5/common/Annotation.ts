export class Annotation {
  clientSaveTime: number;
  componentId: string;
  data: any;
  fromWorkgroupId?: number;
  id: number;
  localNotebookItemId?: number;
  nodeId: string;
  notebookItemId: number;
  periodId: number;
  serverSaveTime: number;
  studentWorkId: number;
  toWorkgroupId: number;
  type: string;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
