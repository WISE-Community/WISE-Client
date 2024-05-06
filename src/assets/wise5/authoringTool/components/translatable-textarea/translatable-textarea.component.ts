import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'translatable-textarea',
  imports: [CommonModule, FormsModule, MatIconModule, MatInputModule],
  styleUrls: ['../abstract-translatable-field/abstract-translatable-field.component.scss'],
  templateUrl: './translatable-textarea.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TranslatableTextareaComponent extends AbstractTranslatableFieldComponent {}
