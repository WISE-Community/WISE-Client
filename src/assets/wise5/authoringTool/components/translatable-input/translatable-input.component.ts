import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatInputModule],
  selector: 'translatable-input',
  styleUrl: '../abstract-translatable-field/abstract-translatable-field.component.scss',
  templateUrl: './translatable-input.component.html'
})
export class TranslatableInputComponent extends AbstractTranslatableFieldComponent {
  @Input() protected hasClearButton: boolean = false;
}
