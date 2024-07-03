import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';

@Component({
  imports: [FlexLayoutModule, CallToActionComponent],
  standalone: true,
  styleUrl: './forgot-teacher.component.scss',
  templateUrl: './forgot-teacher.component.html'
})
export class ForgotTeacherComponent {}
