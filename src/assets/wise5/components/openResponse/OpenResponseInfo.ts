import { ComponentInfo } from '../ComponentInfo';

export class OpenResponseInfo extends ComponentInfo {
  protected description: string = $localize`Students type a response to a question or prompt.`;
  protected label: string = $localize`Open Response`;
  protected previewExamples: any[] = [
    {
      label: $localize`Open Response`,
      content: {
        id: 'abcde12345',
        type: 'OpenResponse',
        prompt: 'In your own words, explain what an insulator does and what a conductor does.',
        showSaveButton: false,
        showSubmitButton: true,
        showAddToNotebookButton: false,
        starterSentence: null,
        isStudentAttachmentEnabled: false,
        constraints: []
      }
    }
  ];
}
