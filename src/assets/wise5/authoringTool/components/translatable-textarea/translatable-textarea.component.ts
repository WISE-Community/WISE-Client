import { Component } from '@angular/core';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';

@Component({
  standalone: true,
  selector: 'translatable-textarea',
  imports: [CommonModule, FormsModule, MatInputModule],
  providers: [EditProjectTranslationService],
  styleUrls: ['./translatable-textarea.component.scss'],
  templateUrl: './translatable-textarea.component.html'
})
export class TranslatableTextareaComponent extends AbstractTranslatableFieldComponent {}
