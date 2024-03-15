import { ComponentInfo } from '../ComponentInfo';

export class AiChatInfo extends ComponentInfo {
  protected description: string = $localize`Students chat with an AI bot.`;
  protected label: string = $localize`AI Chat`;
  protected previewExamples: any[] = [
    {
      label: $localize`AI Chat`,
      content: {
        id: 'abcde12345',
        type: 'AiChat',
        prompt:
          "Let's think about how global warming happens. At the end of the project you will revise your answer to this question. On a cold winter day, Akbar is walking to his car that is parked in the sun. His car has not been driven for one week. How will the temperature inside the car feel? Hint: Akbar wonders if what happens in his car is similar to the greenhouse effect.",
        model: 'gpt-4',
        systemPrompt:
          'You are a teacher helping a student understand the greenhouse effect by using the example of the inside of a car heating up from the sun on a cold day. You do not tell them the correct answer but you do guide them to the correct answer. Also make sure they explain their reasoning. Limit your response to 100 words or less.',
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
          initialResponse: 'Can you explain what happens to the temperature inside the car?'
        }
      }
    }
  ];
}
