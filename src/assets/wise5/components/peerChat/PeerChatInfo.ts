import { ComponentInfo } from '../ComponentInfo';

export class PeerChatInfo extends ComponentInfo {
  protected description: string = $localize`Students are grouped with other students to discuss a topic.`;
  protected label: string = $localize`Peer Chat`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'PeerChat',
    prompt: `<p>Hi! You've been paired with a classmate to improve your explanation to the question: "How do you think Mt. Hood formed?"</p>
      <p>Discuss with your partner in this chat!<br>If you agree, you can describe what you agree on and try to elaborate. If you disagree, try to figure out why.</p>
      <p>You can use questions from the Question Bank if you want help connecting your ideas.</p>`,
    showSaveButton: false,
    showSubmitButton: false,
    peerGroupingTag: '',
    questionBank: {
      version: 2,
      enabled: true,
      maxQuestionsToShow: 3,
      clickToUseEnabled: true,
      rules: [
        {
          id: 'lt6a6dwpq3',
          expression: 'true',
          questions: [
            {
              text: 'How does convection affect plate movement where Mt. Hood is located?',
              id: 'vwv7dnbm28'
            },
            {
              text: 'How does density have an effect on how plates interact with one another? ',
              id: 'vwv7dnbm29'
            },
            {
              text: 'Do you agree or disagree with your partner? What would you add or build on?',
              id: 'vwv7dnbm27'
            }
          ]
        }
      ]
    },
    constraints: []
  };
}
