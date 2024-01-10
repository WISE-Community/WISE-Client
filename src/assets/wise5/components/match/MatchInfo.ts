import { ComponentInfo } from '../ComponentInfo';

export class MatchInfo extends ComponentInfo {
  protected description: string = $localize`Students sort items into different buckets.`;
  protected label: string = $localize`Match`;
  protected previewExamples: any[] = [
    {
      label: $localize`Match`,
      content: {
        id: 'abcde12345',
        type: 'Match',
        prompt:
          'Sort the different environmental pressures that organisms can face into biotic and abiotic pressures.',
        showSaveButton: false,
        showSubmitButton: true,
        choices: [
          {
            id: 'evhs07qtqu',
            type: 'choice',
            value: 'Predators'
          },
          {
            id: 'sa5w70scaw',
            type: 'choice',
            value: 'Dangerous viruses'
          },
          {
            id: 'ofm2mo5mgy',
            type: 'choice',
            value: 'High temperatures'
          },
          {
            id: '3unza7haw1',
            type: 'choice',
            value: 'Lack of water'
          },
          {
            id: '21noaztqyb',
            type: 'choice',
            value: 'Siblings competing for territory'
          },
          {
            id: 'i5n25oq6qy',
            type: 'choice',
            value: 'Air pollution'
          },
          {
            id: '6vbjwoo64q',
            type: 'choice',
            value: 'Not enough food (prey)'
          },
          {
            id: 'b8lhey6tgp',
            type: 'choice',
            value: 'Strong sun light'
          },
          {
            id: 'ocm53nhs1f',
            type: 'choice',
            value: 'Parasites'
          },
          {
            id: 'rzas42rtvc',
            type: 'choice',
            value: 'Sand storms'
          }
        ],
        choiceReuseEnabled: false,
        buckets: [
          {
            id: 'k7zphrnrym',
            type: 'bucket',
            value: 'Biotic pressures'
          },
          {
            id: 't7ij83fu78',
            type: 'bucket',
            value: 'Abiotic pressures'
          }
        ],
        choicesLabel: 'Environmental pressures',
        feedback: [
          {
            bucketId: '0',
            choices: [
              {
                choiceId: 'evhs07qtqu',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'sa5w70scaw',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'ofm2mo5mgy',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '3unza7haw1',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '21noaztqyb',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'i5n25oq6qy',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '6vbjwoo64q',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'b8lhey6tgp',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'ocm53nhs1f',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'rzas42rtvc',
                feedback: '',
                isCorrect: false
              }
            ]
          },
          {
            bucketId: 'k7zphrnrym',
            choices: [
              {
                choiceId: 'evhs07qtqu',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'sa5w70scaw',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'ofm2mo5mgy',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '3unza7haw1',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '21noaztqyb',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'i5n25oq6qy',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: '6vbjwoo64q',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'b8lhey6tgp',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'ocm53nhs1f',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'rzas42rtvc',
                feedback: '',
                isCorrect: false
              }
            ]
          },
          {
            bucketId: 't7ij83fu78',
            choices: [
              {
                choiceId: 'evhs07qtqu',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'sa5w70scaw',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'ofm2mo5mgy',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: '3unza7haw1',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: '21noaztqyb',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'i5n25oq6qy',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: '6vbjwoo64q',
                feedback: 'Think - what do animals usually eat?',
                isCorrect: false
              },
              {
                choiceId: 'b8lhey6tgp',
                feedback: '',
                isCorrect: true
              },
              {
                choiceId: 'ocm53nhs1f',
                feedback: '',
                isCorrect: false
              },
              {
                choiceId: 'rzas42rtvc',
                feedback: '',
                isCorrect: true
              }
            ]
          }
        ],
        ordered: false,
        constraints: []
      }
    }
  ];
}
