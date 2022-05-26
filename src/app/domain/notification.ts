export class Notification {
  componentId: string;
  componentType: string;
  data: any;
  fromWorkgroupId: number;
  groupId: string;
  id: number;
  message: string;
  nodeId: string;
  nodePosition: string;
  nodePositionAndTitle: string;
  periodId: number;
  runId: number;
  serverSaveTime: number;
  timeDismissed?: number;
  timeGenerated: number;
  toWorkgroupId: number;
  type: string;
  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}
