export class TransitionCriteriaParams {
  choiceIds?: string[];
  componentId: string;
  nodeId: string;
  scores?: string[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
