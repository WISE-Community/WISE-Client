import { Component } from '@angular/core';
import { FaqComponent } from '../faq.component';
import { MatDividerModule } from '@angular/material/divider';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CallToActionComponent, FlexLayoutModule, MatDividerModule, MatIconModule],
  standalone: true,
  templateUrl: './getting-started.component.html'
})
export class GettingStartedComponent extends FaqComponent {}
