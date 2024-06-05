import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddYourOwnNode } from '../../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeTemplate } from '../../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { CardSelectorComponent } from '../../assets/wise5/authoringTool/components/card-selector/card-selector.component';
import { RequiredErrorLabelComponent } from '../../assets/wise5/authoringTool/node/advanced/required-error-label/required-error-label.component';
import { RubricAuthoringComponent } from '../../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { NodeIconChooserDialog } from '../../assets/wise5/common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
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
import { StepToolsModule } from '../../assets/wise5/themes/default/themeComponents/stepTools/step-tools.module';
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
import { ComponentTypeButtonComponent } from '../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { ComponentInfoDialogComponent } from '../../assets/wise5/authoringTool/components/component-info-dialog/component-info-dialog.component';
import { EditNodeTitleComponent } from '../../assets/wise5/authoringTool/node/edit-node-title/edit-node-title.component';
import { AddComponentButtonComponent } from '../../assets/wise5/authoringTool/node/add-component-button/add-component-button.component';
import { CopyComponentButtonComponent } from '../../assets/wise5/authoringTool/node/copy-component-button/copy-component-button.component';
import { SaveIndicatorComponent } from '../../assets/wise5/common/save-indicator/save-indicator.component';
import { ProjectAuthoringLessonComponent } from '../../assets/wise5/authoringTool/project-authoring-lesson/project-authoring-lesson.component';
import { ProjectAuthoringStepComponent } from '../../assets/wise5/authoringTool/project-authoring-step/project-authoring-step.component';
import { AddLessonButtonComponent } from '../../assets/wise5/authoringTool/add-lesson-button/add-lesson-button.component';
import { AddStepButtonComponent } from '../../assets/wise5/authoringTool/add-step-button/add-step-button.component';
import { PreviewComponentButtonComponent } from '../../assets/wise5/authoringTool/components/preview-component-button/preview-component-button.component';

@NgModule({
  declarations: [
    AddLessonChooseTemplateComponent,
    AddLessonConfigureComponent,
    AddProjectComponent,
    AddYourOwnNode,
    AdvancedProjectAuthoringComponent,
    AuthoringToolComponent,
    AuthoringToolBarComponent,
    CardSelectorComponent,
    ChooseAutomatedAssessmentComponent,
    ChooseComponentLocationComponent,
    ChooseCopyNodeLocationComponent,
    ChooseImportStepComponent,
    ChooseImportUnitComponent,
    ChooseNewComponent,
    ChooseNewNodeTemplate,
    ChooseMoveNodeLocationComponent,
    ChooseSimulationComponent,
    ComponentTypeButtonComponent,
    ConcurrentAuthorsMessageComponent,
    ConfigureAutomatedAssessmentComponent,
    CopyComponentButtonComponent,
    EditNodeTitleComponent,
    InsertNodeAfterButtonComponent,
    InsertNodeInsideButtonComponent,
    MilestonesAuthoringComponent,
    NodeAuthoringComponent,
    NodeAuthoringParentComponent,
    NodeIconChooserDialog,
    NodeIconAndTitleComponent,
    NodeWithMoveAfterButtonComponent,
    NotebookAuthoringComponent,
    ProjectInfoAuthoringComponent,
    ProjectAuthoringComponent,
    ProjectAuthoringParentComponent,
    ProjectAuthoringLessonComponent,
    ProjectAuthoringStepComponent,
    RecoveryAuthoringComponent,
    RequiredErrorLabelComponent,
    RubricAuthoringComponent,
    TeacherNodeIconComponent,
    TopBarComponent,
    ProjectListComponent
  ],
  imports: [
    AddComponentButtonComponent,
    AddLessonButtonComponent,
    AddStepButtonComponent,
    StudentTeacherCommonModule,
    ComponentAuthoringModule,
    ComponentInfoDialogComponent,
    ComponentStudentModule,
    MatBadgeModule,
    MatChipsModule,
    ImportComponentModule,
    NodeAdvancedAuthoringModule,
    PreviewComponentButtonComponent,
    ProjectAssetAuthoringModule,
    RouterModule,
    SaveIndicatorComponent,
    StepToolsModule,
    StructureAuthoringModule,
    WiseTinymceEditorModule
  ]
})
export class AuthoringToolModule {}
