import { ComponentInfo } from '../ComponentInfo';

export class SummaryInfo extends ComponentInfo {
  protected description: string = $localize`Students are shown an aggregate graph summarizing data from the class.`;
  protected icon: string = 'pie_chart';
  protected label: string = $localize`Summary Graph`;
  protected previewExamples: any[] = [
    {
      lable: $localize`Summary Graph`,
      content: {
        id: 'abcde12345',
        type: 'Summary',
        prompt: 'This graph shows a summary of the data collected by you and your classmates:',
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
      }
    }
  ];
}
