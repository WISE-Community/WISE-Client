import { NgModule } from '@angular/core';
import { TranslatableInputComponent } from '../authoringTool/components/translatable-input/translatable-input.component';
import { EditProjectTranslationService } from '../services/editProjectTranslationService';

@NgModule({
  imports: [TranslatableInputComponent],
  providers: [EditProjectTranslationService],
  exports: [TranslatableInputComponent]
})
export class ComponentAuthoringModule {}
