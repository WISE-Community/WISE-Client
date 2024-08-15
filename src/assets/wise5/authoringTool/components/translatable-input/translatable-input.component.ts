import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'translatable-input',
  imports: [CommonModule, FormsModule, MatIconModule, MatInputModule],
  styleUrl: '../abstract-translatable-field/abstract-translatable-field.component.scss',
  templateUrl: './translatable-input.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TranslatableInputComponent extends AbstractTranslatableFieldComponent {}
