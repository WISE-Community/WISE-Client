import { NgModule } from '@angular/core';
import { TranslatableInputComponent } from '../authoringTool/components/translatable-input/translatable-input.component';
import { TeacherProjectTranslationService } from '../services/teacherProjectTranslationService';
import { TranslatableTextareaComponent } from '../authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableAssetChooserComponent } from '../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';

@NgModule({
  imports: [
    TranslatableAssetChooserComponent,
    TranslatableInputComponent,
    TranslatableTextareaComponent
  ],
  providers: [TeacherProjectTranslationService],
  exports: [
    TranslatableAssetChooserComponent,
    TranslatableInputComponent,
    TranslatableTextareaComponent
  ]
})
export class ComponentAuthoringModule {}
