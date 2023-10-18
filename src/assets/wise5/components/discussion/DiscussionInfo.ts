import { ComponentInfo } from '../ComponentInfo';

export class DiscussionInfo extends ComponentInfo {
  description: string = $localize`The student posts messages for the whole class to see.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'Discussion',
    prompt: 'Post a message for the class to view.',
    showSaveButton: false,
    showSubmitButton: false,
    isStudentAttachmentEnabled: true,
    gateClassmateResponses: true,
    constraints: []
  };
}
