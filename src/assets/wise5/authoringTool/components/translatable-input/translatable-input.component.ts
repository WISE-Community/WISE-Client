import { Component, ViewEncapsulation } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatIconModule, MatInputModule],
  selector: 'translatable-input',
  styleUrl: '../abstract-translatable-field/abstract-translatable-field.component.scss',
  templateUrl: './translatable-input.component.html'
})
export class TranslatableInputComponent extends AbstractTranslatableFieldComponent {}
