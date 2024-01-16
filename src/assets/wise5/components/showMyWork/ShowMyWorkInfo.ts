import { ComponentInfo } from '../ComponentInfo';

export class ShowMyWorkInfo extends ComponentInfo {
  protected description: string = $localize`Students are shown work that they submitted for a specific item.`;
  protected label: string = $localize`Show My Work`;
  protected previewExamples: any[] = [
    {
      label: $localize`Show My Work`,
      content: {
        id: 'abcde12345',
        type: 'ShowMyWork',
        prompt: 'Here is your previous answer to the question "How do you think Mt. Hood formed?":',
        showSaveButton: false,
        showSubmitButton: false,
        showWorkNodeId: '',
        showWorkComponentId: '',
        constraints: []
      }
    }
  ];
}
