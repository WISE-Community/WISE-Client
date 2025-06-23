import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChooseNewComponent } from '../authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ComponentAuthoringModule } from './component-authoring.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { MatChipsModule } from '@angular/material/chips';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ProjectAuthoringComponent } from '../../assets/wise5/authoringTool/project-authoring/project-authoring.component';
import { AuthoringToolComponent } from '../../assets/wise5/authoringTool/authoring-tool.component';
import { NodeIconAndTitleComponent } from '../../assets/wise5/authoringTool/choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { ProjectAuthoringLessonComponent } from '../../assets/wise5/authoringTool/project-authoring-lesson/project-authoring-lesson.component';
import { ProjectAuthoringStepComponent } from '../../assets/wise5/authoringTool/project-authoring-step/project-authoring-step.component';
import { AddLessonButtonComponent } from '../../assets/wise5/authoringTool/add-lesson-button/add-lesson-button.component';
import { TranslatableInputComponent } from '../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { TranslatableTextareaComponent } from '../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableRichTextEditorComponent } from '../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { ComponentTypeButtonComponent } from '../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { WiseAuthoringTinymceEditorComponent } from '../../assets/wise5/directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';

@NgModule({
  declarations: [MilestonesAuthoringComponent, ProjectAuthoringComponent],
  imports: [
    AddLessonButtonComponent,
    AuthoringToolComponent,
    ChooseNewComponent,
    ComponentAuthoringModule,
    ComponentStudentModule,
    ComponentTypeButtonComponent,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    NodeIconAndTitleComponent,
    ProjectAuthoringLessonComponent,
    ProjectAuthoringStepComponent,
    RouterModule,
    StudentTeacherCommonModule,
    TranslatableInputComponent,
    TranslatableRichTextEditorComponent,
    TranslatableTextareaComponent,
    WiseAuthoringTinymceEditorComponent
  ]
})
export class AuthoringToolModule {}
