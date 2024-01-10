import { ComponentInfo } from '../ComponentInfo';

export class DiscussionInfo extends ComponentInfo {
  protected description: string = $localize`Students post messages for the whole class to see and can reply to other students' posts.`;
  protected label: string = $localize`Discussion`;
  protected previewExamples: any[] = [
    {
      label: $localize`Discussion`,
      content: {
        id: 'abcde12345',
        type: 'Discussion',
        prompt:
          'Based on your findings, how does the color of the sand affect the population of fish? Post your ideas to share with the class.',
        showSaveButton: false,
        showSubmitButton: false,
        isStudentAttachmentEnabled: true,
        gateClassmateResponses: true,
        constraints: []
      }
    }
  ];
}
