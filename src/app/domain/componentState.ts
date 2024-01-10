export class ComponentState {
  id?: number;
  clientSaveTime: number;
  componentId: string;
  componentType: string;
  isSubmit: boolean;
  nodeId: string;
  peerGroupId?: number;
  periodId: number;
  runId: number;
  serverSaveTime?: number;
  studentData: any;
  workgroupId: number;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
