import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'component-header',
  styleUrls: ['component-header.component.scss'],
  templateUrl: 'component-header.component.html'
})
export class ComponentHeader {
  @Input()
  componentContent: any;

  dynamicPrompt: DynamicPrompt;

  prompt: SafeHtml;

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.prompt = this.sanitizer.bypassSecurityTrustHtml(this.componentContent.prompt);
    this.dynamicPrompt = new DynamicPrompt(this.componentContent.dynamicPrompt);
  }
}
