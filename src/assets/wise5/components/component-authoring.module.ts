import { NgModule } from '@angular/core';
import { TranslatableInputComponent } from '../authoringTool/components/translatable-input/translatable-input.component';
import { EditProjectTranslationService } from '../services/editProjectTranslationService';
import { TranslatableTextareaComponent } from '../authoringTool/components/translatable-textarea/translatable-textarea.component';

@NgModule({
  imports: [TranslatableInputComponent, TranslatableTextareaComponent],
  providers: [EditProjectTranslationService],
  exports: [TranslatableInputComponent, TranslatableTextareaComponent]
})
export class ComponentAuthoringModule {}
