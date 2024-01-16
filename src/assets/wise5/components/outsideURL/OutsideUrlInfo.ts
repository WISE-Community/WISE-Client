import { ComponentInfo } from '../ComponentInfo';

export class OutsideUrlInfo extends ComponentInfo {
  protected description: string = $localize`Students view an external website.`;
  protected label: string = $localize`Outside Resource`;
  protected previewExamples: any[] = [
    {
      label: $localize`Outside Resource`,
      content: {
        id: 'abcde12345',
        type: 'OutsideURL',
        prompt: 'Play with the model.',
        showSaveButton: false,
        showSubmitButton: false,
        url:
          'https://lab.concord.org/embeddable.html#interactives/air-pollution/air-pollution-master.json',
        height: 600,
        info: 'https://learn.concord.org/resources/855/air-pollution-model-cross-section',
        constraints: []
      }
    }
  ];
}
