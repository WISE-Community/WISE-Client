import { ComponentState } from '../../../../app/domain/componentState';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';
import { MultipleChoiceSummaryDataPoint } from './MultipleChoiceSummaryDataPoint';

export class MultipleChoiceSummaryData {
  private summaryDataPoints: MultipleChoiceSummaryDataPoint[];

  constructor(componentState: MultipleChoiceContent, componentStates: ComponentState[]) {
    this.summaryDataPoints = [];
    this.createChoicesSummaryData(componentState, componentStates);
  }

  private createChoicesSummaryData(
    componentState: MultipleChoiceContent,
    componentStates: ComponentState[]
  ): void {
    for (const choice of componentState.choices) {
      this.summaryDataPoints.push(
        new MultipleChoiceSummaryDataPoint(choice.id, choice.text, choice.isCorrect)
      );
    }
    for (const componentState of componentStates) {
      this.addComponentStateDataToSummaryData(componentState);
    }
  }

  private addComponentStateDataToSummaryData(componentState: ComponentState): void {
    for (const choice of componentState.studentData.studentChoices) {
      this.incrementSummaryData(choice.id);
    }
  }

  private incrementSummaryData(id: number | string): void {
    this.summaryDataPoints.forEach((dataPoint) => {
      if (dataPoint.getId() === id) {
        dataPoint.incrementCount();
      }
    });
  }
}
