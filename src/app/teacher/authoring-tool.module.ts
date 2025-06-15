import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { RubricAuthoringComponent } from '../../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { ChooseNewComponent } from '../authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ComponentAuthoringModule } from './component-authoring.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { ConcurrentAuthorsMessageComponent } from '../../assets/wise5/authoringTool/concurrent-authors-message/concurrent-authors-message.component';
import { NodeAdvancedAuthoringModule } from '../../assets/wise5/authoringTool/node/advanced/node-advanced-authoring.module';
import { NodeAuthoringComponent } from '../../assets/wise5/authoringTool/node/node-authoring/node-authoring.component';
import { TeacherNodeIconComponent } from '../../assets/wise5/authoringTool/teacher-node-icon/teacher-node-icon.component';
import { MatChipsModule } from '@angular/material/chips';
import { WiseTinymceEditorModule } from '../../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { NotebookAuthoringComponent } from '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { ProjectAssetAuthoringModule } from '../../assets/wise5/authoringTool/project-asset-authoring/project-asset-authoring.module';
import { ProjectInfoAuthoringComponent } from '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component';
import { ProjectListComponent } from '../../assets/wise5/authoringTool/project-list/project-list.component';
import { AddProjectComponent } from '../../assets/wise5/authoringTool/add-project/add-project.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ProjectAuthoringComponent } from '../../assets/wise5/authoringTool/project-authoring/project-authoring.component';
import { AuthoringToolComponent } from '../../assets/wise5/authoringTool/authoring-tool.component';
import { ChooseMoveNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component';
import { ChooseCopyNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component';
import { InsertNodeAfterButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/insert-node-after-button/insert-node-after-button.component';
import { InsertNodeInsideButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/insert-node-inside-button/insert-node-inside-button.component';
import { NodeIconAndTitleComponent } from '../../assets/wise5/authoringTool/choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeWithMoveAfterButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/node-with-move-after-button/node-with-move-after-button.component';
import { ProjectAuthoringParentComponent } from '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component';
import { NodeAuthoringParentComponent } from '../../assets/wise5/authoringTool/node/node-authoring-parent/node-authoring-parent.component';
import { EditNodeTitleComponent } from '../../assets/wise5/authoringTool/node/edit-node-title/edit-node-title.component';
import { EditProjectLanguageSettingComponent } from '../../assets/wise5/authoringTool/project-info/edit-project-language-setting/edit-project-language-setting.component';
import { CopyComponentButtonComponent } from '../../assets/wise5/authoringTool/node/copy-component-button/copy-component-button.component';
import { ProjectAuthoringLessonComponent } from '../../assets/wise5/authoringTool/project-authoring-lesson/project-authoring-lesson.component';
import { ProjectAuthoringStepComponent } from '../../assets/wise5/authoringTool/project-authoring-step/project-authoring-step.component';
import { AddLessonButtonComponent } from '../../assets/wise5/authoringTool/add-lesson-button/add-lesson-button.component';
import { TranslatableInputComponent } from '../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { TranslatableTextareaComponent } from '../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableRichTextEditorComponent } from '../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { AddStepButtonComponent } from '../../assets/wise5/authoringTool/add-step-button/add-step-button.component';
import { EditBranchComponent } from '../../assets/wise5/authoringTool/edit-branch/edit-branch.component';
import { ComponentTypeButtonComponent } from '../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddComponentComponent } from '../../assets/wise5/authoringTool/node/add-component/add-component.component';
import { ChooseImportComponentComponent } from '../../assets/wise5/authoringTool/importComponent/choose-import-component/choose-import-component.component';
import { EditUnitResourcesComponent } from '../../assets/wise5/authoringTool/edit-unit-resources/edit-unit-resources.component';
import { EditUnitTypeComponent } from '../../assets/wise5/authoringTool/edit-unit-type/edit-unit-type.component';

@NgModule({
  declarations: [
    AdvancedProjectAuthoringComponent,
    ChooseMoveNodeLocationComponent,
    ConcurrentAuthorsMessageComponent,
    EditProjectLanguageSettingComponent,
    MilestonesAuthoringComponent,
    NodeAuthoringComponent,
    NodeAuthoringParentComponent,
    NotebookAuthoringComponent,
    ProjectInfoAuthoringComponent,
    ProjectAuthoringComponent,
    ProjectAuthoringParentComponent,
    ProjectAuthoringLessonComponent,
    ProjectAuthoringStepComponent,
    RecoveryAuthoringComponent,
    RubricAuthoringComponent
  ],
  imports: [
    AddComponentComponent,
    AddLessonButtonComponent,
    AddProjectComponent,
    AddStepButtonComponent,
    AuthoringToolComponent,
    ChooseCopyNodeLocationComponent,
    ChooseImportComponentComponent,
    ChooseNewComponent,
    ComponentAuthoringModule,
    ComponentStudentModule,
    ComponentTypeButtonComponent,
    CopyComponentButtonComponent,
    EditBranchComponent,
    EditNodeTitleComponent,
    EditUnitResourcesComponent,
    EditUnitTypeComponent,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    InsertNodeAfterButtonComponent,
    InsertNodeInsideButtonComponent,
    NgSelectModule,
    NodeAdvancedAuthoringModule,
    NodeIconAndTitleComponent,
    NodeWithMoveAfterButtonComponent,
    ProjectAssetAuthoringModule,
    ProjectListComponent,
    RouterModule,
    StudentTeacherCommonModule,
    TeacherNodeIconComponent,
    TranslatableInputComponent,
    TranslatableRichTextEditorComponent,
    TranslatableTextareaComponent,
    WiseTinymceEditorModule
  ]
})
export class AuthoringToolModule {}
