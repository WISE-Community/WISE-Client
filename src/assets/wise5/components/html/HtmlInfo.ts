import { ComponentInfo } from '../ComponentInfo';

export class HtmlInfo extends ComponentInfo {
  protected description: string = $localize`Students view rich text (HTML) content.`;
  protected label: string = $localize`Rich Text (HTML)`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'HTML',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    html: `<h3 style="text-align: center;"><span style="color: #000000; background-color: #fbeeb8; font-size: 24pt;"><strong>How does the Sun warm the Earth?</strong></span></h3>
      <p style="text-align: center;"><span style="font-size: 14pt;"><strong><img src="/assets/img/component-preview/sun.png" alt="sun" width="100" height="100" /></strong></span></p>
      <p><span style="font-size: 14pt;">You probably know that the Sun keeps us warm on Earth. But do you know how the Sun does that?</span></p>
      <p><span style="font-size: 14pt;"><strong><span style="color: #843fa1;">In this lesson, you'll explore the following questions:</span><br /></strong></span></p>
      <ul>
        <li><span style="font-size: 14pt;">How does the Sun's energy travel to the Earth?</span></li>
        <li><span style="font-size: 14pt;">What happens to the Sun's energy when it reaches the Earth?</span></li>
        <li><span style="font-size: 14pt;">How does the Sun's energy warm the Earth?</span></li>
      </ul>`,
    constraints: []
  };
}
