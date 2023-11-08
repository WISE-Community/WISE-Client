import { ComponentInfo } from '../ComponentInfo';

export class ShowGroupWorkInfo extends ComponentInfo {
  protected description: string = $localize`Students are shown work that everyone in their group submitted for a specific item.`;
  protected label: string = $localize`Show Group Work`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'ShowGroupWork',
    prompt: `Hi! You've been paired with a classmate to improve your explanation.<br>Here are your responses to the question "How do you think Mt. Hood formed?":`,
    showSaveButton: false,
    showSubmitButton: false,
    showWorkNodeId: '',
    showWorkComponentId: '',
    peerGroupingTag: '',
    isShowMyWork: true,
    layout: 'column',
    constraints: []
  };
}
