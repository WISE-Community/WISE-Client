import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class WroteXNumberOfWordsConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const params = criteria.params;
    const nodeId = params.nodeId;
    const componentId = params.componentId;
    const requiredNumberOfWords = params.requiredNumberOfWords;
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (componentState != null) {
      const studentData = componentState.studentData;
      const response = studentData.response;
      const numberOfWords = this.wordCount(response);
      if (numberOfWords >= requiredNumberOfWords) {
        return true;
      }
    }
    return false;
  }

  private wordCount(str: string): number {
    return str.trim().split(/\s+/).length;
  }
}
