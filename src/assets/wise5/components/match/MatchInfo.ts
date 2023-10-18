import { ComponentInfo } from '../ComponentInfo';

export class MatchInfo extends ComponentInfo {
  description: string = $localize`The student places items into buckets.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'Match',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: true,
    choices: [
      {
        id: 'b414lojonc',
        value: "<img src='/assets/img/component-preview/sun.png'/>"
      },
      {
        id: '56a20j5hvf',
        value: 'Apple'
      }
    ],
    choiceReuseEnabled: false,
    buckets: [
      {
        id: '3ygkgsnl5c',
        value: 'Sun',
        type: 'bucket'
      },
      {
        id: 'np0wbaccfb',
        value: 'Fruit',
        type: 'bucket'
      }
    ],
    feedback: [
      {
        bucketId: '0',
        choices: [
          {
            choiceId: 'b414lojonc',
            feedback: '',
            isCorrect: false
          },
          {
            choiceId: '56a20j5hvf',
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      },
      {
        bucketId: '3ygkgsnl5c',
        choices: [
          {
            choiceId: 'b414lojonc',
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: '56a20j5hvf',
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      },
      {
        bucketId: 'np0wbaccfb',
        choices: [
          {
            choiceId: 'b414lojonc',
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: '56a20j5hvf',
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      }
    ],
    ordered: false,
    constraints: []
  };
}
