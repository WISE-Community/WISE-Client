import { Annotation } from './Annotation';

export class DummyAnnotation extends Annotation {
  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }
}
