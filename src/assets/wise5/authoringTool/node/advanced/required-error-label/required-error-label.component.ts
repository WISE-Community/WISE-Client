import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [FlexLayoutModule, MatIconModule],
  selector: 'required-error-label',
  standalone: true,
  styleUrl: './required-error-label.component.scss',
  templateUrl: './required-error-label.component.html'
})
export class RequiredErrorLabelComponent {}
