import { ValueAndText } from './valueAndText';

export class RemovalCriteriaParam extends ValueAndText {
  defaultValue: any;

  constructor(value: string, text: string, defaultValue: any = '') {
    super(value, text);
    this.defaultValue = defaultValue;
  }
}
