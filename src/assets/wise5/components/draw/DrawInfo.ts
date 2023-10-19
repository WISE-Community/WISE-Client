import { ComponentInfo } from '../ComponentInfo';

export class DrawInfo extends ComponentInfo {
  protected description: string = $localize`The student draws on a canvas.`;
  protected label: string = $localize`Draw`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'Draw',
    prompt: 'Draw a house.',
    showSaveButton: false,
    showSubmitButton: false,
    stamps: {
      Stamps: ['/assets/img/component-preview/sun.png', '/assets/img/component-preview/leaf.png']
    },
    tools: {
      select: true,
      line: true,
      shape: true,
      freeHand: true,
      text: true,
      stamp: true,
      strokeColor: true,
      fillColor: true,
      clone: true,
      strokeWidth: true,
      sendBack: true,
      sendForward: true,
      undo: true,
      redo: true,
      delete: true
    },
    constraints: []
  };
}
