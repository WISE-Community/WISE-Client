import { Component } from '@angular/core';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';

@Component({
  standalone: true,
  selector: 'translatable-input',
  imports: [CommonModule, FormsModule, MatInputModule],
  providers: [EditProjectTranslationService],
  styleUrls: ['./translatable-input.component.scss'],
  templateUrl: './translatable-input.component.html'
})
export class TranslatableInputComponent extends AbstractTranslatableFieldComponent {}
