import { ComponentInfo } from '../ComponentInfo';

export class MultipleChoiceInfo extends ComponentInfo {
  protected description: string = $localize`Students select one or more choices.`;
  protected label: string = $localize`Multiple Choice`;
  protected previewExamples: any[] = [
    {
      label: $localize`Single Answer`,
      content: {
        id: 'abcde12345',
        type: 'MultipleChoice',
        prompt:
          'When touching a hot METAL bowl and a hot WOODEN bowl that have the same temperature:',
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
      }
    },
    {
      label: $localize`Multiple Answer`,
      content: {
        id: 'abcde12345',
        type: 'MultipleChoice',
        prompt:
          'PREDICT: Which materials do you think it will be useful to test for your investigation? (Keeping a cold beverage cold.)',
        showSaveButton: false,
        showSubmitButton: true,
        choiceType: 'checkbox',
        choices: [
          {
            feedback: '',
            id: 'pi76wjaknm',
            text: 'Aluminum',
            isCorrect: false
          },
          {
            feedback: '',
            id: 'btaf2hw3tg',
            text: 'Clay',
            isCorrect: false
          },
          {
            feedback: '',
            id: 'yzz3hpsfaw',
            text: 'Glass',
            isCorrect: false
          },
          {
            feedback: '',
            id: 'r3hm2iz5l5',
            text: 'Plastic',
            isCorrect: false
          },
          {
            feedback: '',
            id: '1ifd6pbeqb',
            text: 'Styrofoam',
            isCorrect: false
          },
          {
            feedback: '',
            id: '544sy1ytam',
            text: 'Wood',
            isCorrect: false
          }
        ],
        showFeedback: true,
        constraints: []
      }
    }
  ];
}
