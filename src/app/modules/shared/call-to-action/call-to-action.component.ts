import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, NgTemplateOutlet, MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-call-to-action',
  styleUrl: './call-to-action.component.scss',
  templateUrl: './call-to-action.component.html'
})
export class CallToActionComponent {
  readonly content = input<string>();
  readonly contentRef = contentChild<TemplateRef<unknown>>('contentTemplate');
  readonly destination = input<string>();
  readonly headline = input<string>();
  readonly headlineRef = contentChild<TemplateRef<unknown>>('headlineTemplate');
  readonly icon = input<string>();
  readonly iconColor = input<string>();
  readonly isOutsideLink = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly isSvgIcon = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly linkTarget = input<string>();
}
