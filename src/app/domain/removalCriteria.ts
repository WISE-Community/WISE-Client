import { RemovalCriteriaParam } from './removalCriteriaParam';
import { ValueAndText } from './valueAndText';

export class RemovalCriteria extends ValueAndText {
  params: any[];

  constructor(value: string, text: string, params: RemovalCriteriaParam[]) {
    super(value, text);
    this.params = params;
  }
}
