export class DynamicPrompt {
  enabled: boolean;
  postPrompt?: string;
  prePrompt?: string;
  referenceComponent: {
    componentId: string;
    nodeId: string;
  };
  rules: any[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}
