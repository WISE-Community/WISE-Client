import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class HasTagConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    return this.tagService.hasTagName(criteria.params.tag);
  }
}
