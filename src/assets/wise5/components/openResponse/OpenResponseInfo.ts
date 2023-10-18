import { ComponentInfo } from '../ComponentInfo';

export class OpenResponseInfo extends ComponentInfo {
  description: string = $localize`The student types a text response.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'OpenResponse',
    prompt: 'How do plants grow?',
    showSaveButton: false,
    showSubmitButton: false,
    starterSentence: null,
    isStudentAttachmentEnabled: false,
    constraints: []
  };
}
