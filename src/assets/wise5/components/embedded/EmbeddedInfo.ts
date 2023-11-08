import { ComponentInfo } from '../ComponentInfo';

export class EmbeddedInfo extends ComponentInfo {
  protected description: string = $localize`Students interact with a custom applicatio, such as a model or simulation.`;
  protected label: string = $localize`Embedded (Custom)`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'Embedded',
    prompt: 'Click the differnt boundary types to view them in action.',
    showSaveButton: false,
    showSubmitButton: false,
    showAddToNotebookButton: false,
    url:
      'https://wise.berkeley.edu/curriculum/shared/plate-tectonics-convection-explorer/v1/index.html?maxWidth=900',
    height: 600,
    constraints: []
  };
}
