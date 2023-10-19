import { ComponentInfo } from '../ComponentInfo';

export class SummaryInfo extends ComponentInfo {
  protected description: string = $localize`The student is shown aggregate graph data of the class.`;
  protected label: string = $localize`Summary`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'Summary',
    prompt: 'This is a summary graph of the class data for a previous step.',
    showSaveButton: false,
    showSubmitButton: false,
    summaryNodeId: null,
    summaryComponentId: null,
    source: 'period',
    studentDataType: null,
    chartType: 'column',
    requirementToSeeSummary: 'submitWork',
    highlightCorrectAnswer: false,
    customLabelColors: [],
    constraints: []
  };
}
