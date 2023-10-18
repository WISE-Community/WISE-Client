import { ComponentInfo } from '../ComponentInfo';

export class ShowGroupWorkInfo extends ComponentInfo {
  description: string = $localize`The student is shown work that their group submitted for a specific step.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'ShowGroupWork',
    prompt: 'This is the work that your group submitted for a previous step.',
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
