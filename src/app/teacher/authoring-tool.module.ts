import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddYourOwnNodeComponent } from '../../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeTemplateComponent } from '../../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { RubricAuthoringComponent } from '../../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { ChooseNewComponent } from '../authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ChooseImportStepComponent } from '../authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { ComponentAuthoringModule } from './component-authoring.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { AddLessonConfigureComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-configure/add-lesson-configure.component';
import { ConcurrentAuthorsMessageComponent } from '../../assets/wise5/authoringTool/concurrent-authors-message/concurrent-authors-message.component';
import { ImportComponentModule } from '../../assets/wise5/authoringTool/importComponent/import-component-module';
import { NodeAdvancedAuthoringModule } from '../../assets/wise5/authoringTool/node/advanced/node-advanced-authoring.module';
import { NodeAuthoringComponent } from '../../assets/wise5/authoringTool/node/node-authoring/node-authoring.component';
import { TeacherNodeIconComponent } from '../../assets/wise5/authoringTool/teacher-node-icon/teacher-node-icon.component';
import { MatChipsModule } from '@angular/material/chips';
import { WiseTinymceEditorModule } from '../../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { NotebookAuthoringComponent } from '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component';
import { StructureAuthoringModule } from '../../assets/wise5/authoringTool/structure/structure-authoring.module';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { ChooseComponentLocationComponent } from '../../assets/wise5/authoringTool/node/chooseComponentLocation/choose-component-location.component';
import { TopBarComponent } from '../../assets/wise5/authoringTool/components/top-bar/top-bar.component';
import { ProjectAssetAuthoringModule } from '../../assets/wise5/authoringTool/project-asset-authoring/project-asset-authoring.module';
import { ChooseSimulationComponent } from '../../assets/wise5/authoringTool/addNode/choose-simulation/choose-simulation.component';
import { ProjectInfoAuthoringComponent } from '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component';
import { ChooseAutomatedAssessmentComponent } from '../../assets/wise5/authoringTool/addNode/choose-automated-assessment/choose-automated-assessment.component';
import { ConfigureAutomatedAssessmentComponent } from '../../assets/wise5/authoringTool/addNode/configure-automated-assessment/configure-automated-assessment.component';
import { ProjectListComponent } from '../../assets/wise5/authoringTool/project-list/project-list.component';
import { AddProjectComponent } from '../../assets/wise5/authoringTool/add-project/add-project.component';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthoringToolBarComponent } from '../../assets/wise5/authoringTool/components/shared/authoring-tool-bar/authoring-tool-bar.component';
import { ProjectAuthoringComponent } from '../../assets/wise5/authoringTool/project-authoring/project-authoring.component';
import { AuthoringToolComponent } from '../../assets/wise5/authoringTool/authoring-tool.component';
import { ChooseMoveNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component';
import { ChooseCopyNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component';
import { InsertNodeAfterButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/insert-node-after-button/insert-node-after-button.component';
import { InsertNodeInsideButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/insert-node-inside-button/insert-node-inside-button.component';
import { NodeIconAndTitleComponent } from '../../assets/wise5/authoringTool/choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeWithMoveAfterButtonComponent } from '../../assets/wise5/authoringTool/choose-node-location/node-with-move-after-button/node-with-move-after-button.component';
import { ProjectAuthoringParentComponent } from '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component';
import { ChooseImportUnitComponent } from '../authoring-tool/import-step/choose-import-unit/choose-import-unit.component';
import { NodeAuthoringParentComponent } from '../../assets/wise5/authoringTool/node/node-authoring-parent/node-authoring-parent.component';
import { AddLessonChooseTemplateComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-choose-template/add-lesson-choose-template.component';
import { EditNodeTitleComponent } from '../../assets/wise5/authoringTool/node/edit-node-title/edit-node-title.component';
import { EditProjectLanguageSettingComponent } from '../../assets/wise5/authoringTool/project-info/edit-project-language-setting/edit-project-language-setting.component';
import { AddComponentButtonComponent } from '../../assets/wise5/authoringTool/node/add-component-button/add-component-button.component';
import { ProjectLanguageChooserComponent } from '../common/project-language-chooser/project-language-chooser.component';
import { CopyComponentButtonComponent } from '../../assets/wise5/authoringTool/node/copy-component-button/copy-component-button.component';
import { SaveIndicatorComponent } from '../../assets/wise5/common/save-indicator/save-indicator.component';
import { ProjectAuthoringLessonComponent } from '../../assets/wise5/authoringTool/project-authoring-lesson/project-authoring-lesson.component';
import { ProjectAuthoringStepComponent } from '../../assets/wise5/authoringTool/project-authoring-step/project-authoring-step.component';
import { AddLessonButtonComponent } from '../../assets/wise5/authoringTool/add-lesson-button/add-lesson-button.component';
import { TranslatableInputComponent } from '../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { TranslatableTextareaComponent } from '../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableRichTextEditorComponent } from '../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { AddStepButtonComponent } from '../../assets/wise5/authoringTool/add-step-button/add-step-button.component';
import { CreateBranchComponent } from '../../assets/wise5/authoringTool/create-branch/create-branch.component';
import { PreviewComponentButtonComponent } from '../../assets/wise5/authoringTool/components/preview-component-button/preview-component-button.component';
import { StepToolsComponent } from '../../assets/wise5/common/stepTools/step-tools.component';
import { EditBranchComponent } from '../../assets/wise5/authoringTool/edit-branch/edit-branch.component';
import { ComponentTypeButtonComponent } from '../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AddLessonChooseTemplateComponent,
    AddLessonConfigureComponent,
    AddProjectComponent,
    AdvancedProjectAuthoringComponent,
    AuthoringToolComponent,
    AuthoringToolBarComponent,
    ChooseAutomatedAssessmentComponent,
    ChooseComponentLocationComponent,
    ChooseCopyNodeLocationComponent,
    ChooseImportStepComponent,
    ChooseImportUnitComponent,
    ChooseMoveNodeLocationComponent,
    ConcurrentAuthorsMessageComponent,
    ConfigureAutomatedAssessmentComponent,
    EditProjectLanguageSettingComponent,
    InsertNodeAfterButtonComponent,
    InsertNodeInsideButtonComponent,
    MilestonesAuthoringComponent,
    NodeAuthoringComponent,
    NodeAuthoringParentComponent,
    NodeWithMoveAfterButtonComponent,
    NotebookAuthoringComponent,
    ProjectInfoAuthoringComponent,
    ProjectAuthoringComponent,
    ProjectAuthoringParentComponent,
    ProjectAuthoringLessonComponent,
    ProjectAuthoringStepComponent,
    RecoveryAuthoringComponent,
    RubricAuthoringComponent,
    TopBarComponent,
    ProjectListComponent
  ],
  imports: [
    CreateBranchComponent,
    AddComponentButtonComponent,
    AddLessonButtonComponent,
    AddStepButtonComponent,
    AddYourOwnNodeComponent,
    ChooseNewNodeTemplateComponent,
    ChooseNewComponent,
    ChooseSimulationComponent,
    ComponentAuthoringModule,
    ComponentStudentModule,
    ComponentTypeButtonComponent,
    CopyComponentButtonComponent,
    EditBranchComponent,
    EditNodeTitleComponent,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    ImportComponentModule,
    NgSelectModule,
    NodeAdvancedAuthoringModule,
    NodeIconAndTitleComponent,
    PreviewComponentButtonComponent,
    ProjectAssetAuthoringModule,
    ProjectLanguageChooserComponent,
    RouterModule,
    SaveIndicatorComponent,
    StepToolsComponent,
    StructureAuthoringModule,
    StudentTeacherCommonModule,
    TeacherNodeIconComponent,
    TranslatableInputComponent,
    TranslatableRichTextEditorComponent,
    TranslatableTextareaComponent,
    WiseTinymceEditorModule
  ]
})
export class AuthoringToolModule {}
