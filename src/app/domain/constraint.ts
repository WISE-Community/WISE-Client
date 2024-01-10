import { RemovalCriteria } from './removalCriteria';

export class Constraint {
  action: string;
  id: string;
  removalConditional: string;
  removalCriteria: RemovalCriteria[];
  targetId: string;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
