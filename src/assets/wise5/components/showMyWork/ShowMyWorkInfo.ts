import { ComponentInfo } from '../ComponentInfo';

export class ShowMyWorkInfo extends ComponentInfo {
  description: string = $localize`The student is shown work that that they submitted for a specific step.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'ShowMyWork',
    prompt: 'This is the work that you submitted for a previous step.',
    showSaveButton: false,
    showSubmitButton: false,
    showWorkNodeId: '',
    showWorkComponentId: '',
    constraints: []
  };
}
