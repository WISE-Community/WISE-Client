import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule, RouterModule],
  selector: 'app-call-to-action',
  standalone: true,
  styleUrl: './call-to-action.component.scss',
  templateUrl: './call-to-action.component.html'
})
export class CallToActionComponent {
  @Input() content: string;
  @ContentChild('contentTemplate', { static: false }) contentRef: TemplateRef<any>;
  @Input() destination: string;
  @Input() headline: string;
  @ContentChild('headlineTemplate', { static: false }) headlineRef: TemplateRef<any>;
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() isOutsideLink: boolean = false;
  @Input() isSvgIcon: boolean = false;
  @Input() linkTarget: string;
}
