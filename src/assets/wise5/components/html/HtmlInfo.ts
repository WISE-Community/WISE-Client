import { ComponentInfo } from '../ComponentInfo';

export class HtmlInfo extends ComponentInfo {
  description: string = $localize`The student views html content.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'HTML',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    html:
      'The <img src="/assets/img/component-preview/sun.png"/> provides light energy to <img src="/assets/img/component-preview/leaf.png"/> to help them grow.',
    constraints: []
  };
}
