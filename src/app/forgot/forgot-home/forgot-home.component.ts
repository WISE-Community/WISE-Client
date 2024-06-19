import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CallToActionComponent } from '../../modules/shared/call-to-action/call-to-action.component';

@Component({
  imports: [CallToActionComponent, FlexLayoutModule],
  standalone: true,
  styleUrl: './forgot-home.component.scss',
  templateUrl: './forgot-home.component.html'
})
export class ForgotHomeComponent {}
