import { NgModule } from '@angular/core';
import { TranslatableInputComponent } from '../authoringTool/components/translatable-input/translatable-input.component';
import { TeacherProjectTranslationService } from '../services/teacherProjectTranslationService';
import { TranslatableTextareaComponent } from '../authoringTool/components/translatable-textarea/translatable-textarea.component';

@NgModule({
  imports: [TranslatableInputComponent, TranslatableTextareaComponent],
  providers: [TeacherProjectTranslationService],
  exports: [TranslatableInputComponent, TranslatableTextareaComponent]
})
export class ComponentAuthoringModule {}
