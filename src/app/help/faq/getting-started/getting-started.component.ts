import { Component } from '@angular/core';
import { FaqComponent } from '../faq.component';
import { MatDividerModule } from '@angular/material/divider';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CallToActionComponent, MatDividerModule, MatIconModule],
  templateUrl: './getting-started.component.html'
})
export class GettingStartedComponent extends FaqComponent {}
