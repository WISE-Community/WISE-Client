import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsVisibleConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const nodeStatus = this.dataService.getNodeStatusByNodeId(criteria.params.nodeId);
    return nodeStatus.isVisible;
  }
}
