import { ComponentInfo } from '../ComponentInfo';

export class EmbeddedInfo extends ComponentInfo {
  description: string = $localize`The student interacts with a custom model.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'Embedded',
    prompt: 'Click the differnt boundary types to view them in action.',
    showSaveButton: false,
    showSubmitButton: false,
    url:
      'https://wise.berkeley.edu/curriculum/shared/plate-tectonics-convection-explorer/v1/index.html?maxWidth=900',
    height: 600,
    constraints: []
  };
}
