import { Component } from '@angular/core';
import { CallToActionComponent } from '../../modules/shared/call-to-action/call-to-action.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CallToActionComponent, FlexLayoutModule],
  selector: 'app-help-home',
  standalone: true,
  styleUrl: './help-home.component.scss',
  templateUrl: './help-home.component.html'
})
export class HelpHomeComponent {}
