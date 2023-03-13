import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class TeacherRemovalConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    return this.configService.getPeriodId() !== criteria.params.periodId;
  }
}
