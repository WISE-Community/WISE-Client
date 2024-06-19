import { Component } from '@angular/core';
import { FaqComponent } from '../faq.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CallToActionComponent, FlexLayoutModule, MatDividerModule, MatIconModule, RouterModule],
  standalone: true,
  templateUrl: './student-faq.component.html'
})
export class StudentFaqComponent extends FaqComponent {}
