import { ComponentState } from '../../../../../app/domain/componentState';
import { MultipleChoiceContent } from '../../../components/multipleChoice/MultipleChoiceContent';
import { MultipleChoiceSummaryDataPoint } from './MultipleChoiceSummaryDataPoint';
import { SummaryData } from './SummaryData';

export class MultipleChoiceSummaryData extends SummaryData {
  protected summaryDataPoints: MultipleChoiceSummaryDataPoint[];

  constructor(
    componentState: MultipleChoiceContent,
    componentStates: ComponentState[],
    dataPoints?: MultipleChoiceSummaryDataPoint[]
  ) {
    if (dataPoints) {
      super(dataPoints);
    } else {
      super();
      this.summaryDataPoints = [];
      this.createChoicesSummaryData(componentState, componentStates);
    }
  }

  private createChoicesSummaryData(
    componentState: MultipleChoiceContent,
    componentStates: ComponentState[]
  ): void {
    for (const choice of componentState.choices) {
      this.summaryDataPoints.push(new MultipleChoiceSummaryDataPoint(choice.id));
    }
    for (const componentState of componentStates) {
      this.addComponentStateDataToSummaryData(componentState);
    }
  }

  private addComponentStateDataToSummaryData(componentState: ComponentState): void {
    for (const choice of componentState.studentData.studentChoices) {
      this.incrementSummaryData(choice.id, 1);
    }
  }

  protected generateNewDataPoint(id: string | number): MultipleChoiceSummaryDataPoint {
    return new MultipleChoiceSummaryDataPoint(id);
  }
}
