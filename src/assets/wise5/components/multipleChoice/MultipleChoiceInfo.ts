import { ComponentInfo } from '../ComponentInfo';

export class MultipleChoiceInfo extends ComponentInfo {
  protected description: string = $localize`The student chooses one or more choices.`;
  protected label: string = $localize`Multiple Choice`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'MultipleChoice',
    prompt: 'Choose the fruit.',
    showSaveButton: false,
    showSubmitButton: true,
    choiceType: 'radio',
    choices: [
      {
        id: 'h0bdww4oh5',
        text: '<img src="/assets/img/component-preview/sun.png"/>',
        feedback: '',
        isCorrect: false
      },
      {
        id: 're6btejd1o',
        text: '<img src="/assets/img/component-preview/leaf.png"/>',
        feedback: '',
        isCorrect: true
      },
      {
        id: '5u2px4yxj3',
        text: 'Apple',
        feedback: '',
        isCorrect: true
      }
    ],
    showFeedback: true,
    constraints: []
  };
}
