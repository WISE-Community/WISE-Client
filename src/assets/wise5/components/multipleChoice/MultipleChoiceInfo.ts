import { ComponentInfo } from '../ComponentInfo';

export class MultipleChoiceInfo extends ComponentInfo {
  protected description: string = $localize`Students select one or more choices.`;
  protected label: string = $localize`Multiple Choice`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'MultipleChoice',
    prompt: 'When touching a hot METAL bowl and a hot WOODEN bowl that have the same temperature:',
    showSaveButton: false,
    showSubmitButton: true,
    choiceType: 'radio',
    choices: [
      {
        feedback: '',
        id: '1jmi01ht6t',
        text: 'The metal bowl will feel hotter.'
      },
      {
        feedback: '',
        id: '46r96bhek5',
        text: 'The wooden bowl will feel hotter.'
      },
      {
        feedback: '',
        id: 'xuikkjc99u',
        text: 'The bowls will feel the same.'
      }
    ],
    showFeedback: true,
    constraints: []
  };
}
