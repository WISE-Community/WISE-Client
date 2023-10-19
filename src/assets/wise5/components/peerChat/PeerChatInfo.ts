import { ComponentInfo } from '../ComponentInfo';

export class PeerChatInfo extends ComponentInfo {
  protected description: string = $localize`The student is paired up with another student and they chat about a topic.`;
  protected label: string = $localize`Peer Chat`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'PeerChat',
    prompt: 'Chat with your classmate about how plants grow.',
    showSaveButton: false,
    showSubmitButton: false,
    peerGroupingTag: '',
    constraints: []
  };
}
