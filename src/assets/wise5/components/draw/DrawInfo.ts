import { ComponentInfo } from '../ComponentInfo';

export class DrawInfo extends ComponentInfo {
  protected description: string = $localize`Students draw on a canvas using a variety of tools.`;
  protected label: string = $localize`Draw`;
  protected previewExamples: any[] = [
    {
      label: $localize`Draw`,
      content: {
        id: 'abcde12345',
        type: 'Draw',
        prompt: `<p>Draw the path of electrons in a METAL molecular structure. Make sure you distinguish this sketch from your sketch of the plastic and tire rubber in the previous activities.</p>
      <ol><li>Use the STAMP tool to place 2 valence electrons on the metal structure.</li><li>Use the stamp tool to shade the part of the atomic structure where each electron spends its time.</ol>`,
        showSaveButton: false,
        showSubmitButton: false,
        showAddToNotebookButton: false,
        background: '/assets/img/component-preview/metal_draw.jpg',
        stamps: {
          Stamps: [
            '/assets/img/component-preview/electron.png',
            '/assets/img/component-preview/highlight.png'
          ]
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
      }
    }
  ];
}
