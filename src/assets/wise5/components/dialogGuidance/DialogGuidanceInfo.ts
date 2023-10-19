import { ComponentInfo } from '../ComponentInfo';

export class DialogGuidanceInfo extends ComponentInfo {
  protected description: string = $localize`The student chats with a computer avatar about a specific topic.`;
  protected label: string = $localize`Dialog Guidance`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'DialogGuidance',
    prompt:
      "Explain!\n<br>Use what you've learned about how the Sun warms the Earth to explain your answer.",
    showSaveButton: false,
    showSubmitButton: false,
    itemId: 'CarOnAColdDay_score-ki_idea-ki_nonscorable',
    feedbackRules: [
      {
        feedback: ['Thank you for chatting with me! Now revise your explanation in the box below.'],
        expression: 'isFinalSubmit'
      },
      {
        feedback: [
          "What's an idea you feel unsure about and chose not to include in your explanation?"
        ],
        expression: 'isSecondToLastSubmit'
      },
      {
        feedback: [
          'Interesting ideas! Can you tell me about how you feel if you are sitting inside a car and the sunlight shines on you through the window?'
        ],
        expression: '2'
      },
      {
        feedback: [
          'Can you tell me more about how the temperature inside the car changes the longer it sits in the sun?'
        ],
        expression: '3'
      },
      {
        feedback: [
          'Can you tell me more about how the Sun makes the inside of the car warmer than outside?'
        ],
        expression: '3a'
      },
      {
        feedback: [
          'Interesting idea! Can you tell me about how you feel if you are sitting inside a car and the sunlight shines on you through the window?'
        ],
        expression: '4'
      },
      {
        feedback: [
          'You’re right that heat energy moves from warmer objects to colder ones until they reach the same temperature. Can you tell me more about how energy gets from the sun to the car?'
        ],
        expression: '5'
      },
      {
        feedback: [
          'You’re right that heat energy is conducted between objects that touch each other. Since the Sun is far away, how can its energy warm the car?'
        ],
        expression: '6'
      },
      {
        feedback: ['Can you tell me more about the forms of energy that come from the sun?'],
        expression: '7'
      },
      {
        feedback: ['Interesting idea! How does the sun make the car warmer?'],
        expression: '8'
      },
      {
        feedback: [
          'Since Akbar has left, how might the Sun influence the temperature inside the car?'
        ],
        expression: '9'
      },
      {
        feedback: [
          'Can you tell me more about how the material impacts the way the car gets energy from the sun?'
        ],
        expression: '10'
      },
      {
        feedback: ['Have you ever felt warm inside a car even when the heater wasn’t on?'],
        expression: '11'
      },
      {
        feedback: ['What happens to the Sun’s rays when they reach the car?'],
        expression: '12'
      },
      {
        feedback: ['Can you tell me more about how a car is like a greenhouse?'],
        expression: '12a'
      },
      {
        feedback: ['Can you tell me more about how greenhouse gases cause things to get warmer?'],
        expression: '12b'
      },
      {
        feedback: ['What happens to the energy from the sun when it enters the car?'],
        expression: '13'
      },
      {
        feedback: ['What happens to the energy from the sun when it is absorbed by the car?'],
        expression: '14'
      },
      {
        feedback: [
          'You’re right that the color of a material impacts how much sunlight is absorbed. What happens to that energy when it is absorbed?'
        ],
        expression: '14a'
      },
      {
        feedback: ['Can you tell me more about what happens to the heat energy inside the car?'],
        expression: '15'
      },
      {
        feedback: ['What happens to IR inside of the car?'],
        expression: '16'
      },
      {
        feedback: ['What happens to IR inside of the car?'],
        expression: '16a'
      },
      {
        feedback: [
          'Can you tell me more about why IR gets trapped in the car but solar radiation doesn’t?'
        ],
        expression: '17'
      },
      {
        feedback: [
          'Why does heat get trapped in the car but solar radiation doesn’t? What happens when an object has heat energy?'
        ],
        expression: '18'
      },
      {
        feedback: ['Can you tell me more about what exactly is trapped in the car?'],
        expression: '18a'
      },
      {
        feedback: ['Can you tell me more about how the heat got into the car in the first place?'],
        expression: '19'
      },
      {
        feedback: [
          'Can you tell me more about this idea or another one in your explanation? I am still learning about student ideas to become a better thought partner.'
        ],
        expression: 'isDefault'
      }
    ],
    isComputerAvatarEnabled: true,
    computerAvatarSettings: {
      ids: [
        'person1',
        'person2',
        'person3',
        'person4',
        'person5',
        'person6',
        'person7',
        'person8',
        'robot1',
        'robot2'
      ],
      label: 'Thought Buddy',
      prompt: 'Discuss your answer with a thought buddy!',
      initialResponse: "Hi there! It's nice to meet you. What do you think about..."
    },
    version: 2,
    constraints: []
  };
}
