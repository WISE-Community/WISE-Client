import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatIconModule, MatInputModule],
  selector: 'translatable-textarea',
  styleUrl: '../abstract-translatable-field/abstract-translatable-field.component.scss',
  templateUrl: './translatable-textarea.component.html'
})
export class TranslatableTextareaComponent extends AbstractTranslatableFieldComponent {}
