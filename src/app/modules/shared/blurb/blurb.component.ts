import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-blurb',
  standalone: true,
  styleUrl: './blurb.component.scss',
  templateUrl: './blurb.component.html'
})
export class BlurbComponent {
  @Input() content: string;
  @ContentChild('contentTemplate', { static: false }) contentRef: TemplateRef<any>;
  @Input() headline: string;
  @ContentChild('headlineTemplate', { static: false }) headlineRef: TemplateRef<any>;
  @Input() imgDescription: string;
  @Input() imgSources: Object;
  @Input() imgSrc: string;
}
