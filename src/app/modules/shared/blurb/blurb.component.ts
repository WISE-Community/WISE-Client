import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  selector: 'app-blurb',
  styleUrl: './blurb.component.scss',
  templateUrl: './blurb.component.html'
})
export class BlurbComponent {
  readonly content = input<string>();
  readonly contentRef = contentChild<TemplateRef<unknown>>('contentTemplate');
  readonly headline = input<string>();
  readonly headlineRef = contentChild<TemplateRef<unknown>>('headlineTemplate');
  readonly imgDescription = input<string>();
  readonly imgSources = input<any[]>([]);
  readonly imgSrc = input<string>();
}
