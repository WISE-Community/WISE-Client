import { Component } from '@angular/core';
import { FaqComponent } from '../faq.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CallToActionComponent, MatDividerModule, MatIconModule, RouterModule],
  templateUrl: './teacher-faq.component.html'
})
export class TeacherFaqComponent extends FaqComponent {}
