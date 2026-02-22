import { Component } from '@angular/core';
import { CallToActionComponent } from '../../modules/shared/call-to-action/call-to-action.component';

@Component({
  imports: [CallToActionComponent],
  selector: 'app-help-home',
  styleUrl: './help-home.component.scss',
  templateUrl: './help-home.component.html'
})
export class HelpHomeComponent {}
