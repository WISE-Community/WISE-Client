import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddYourOwnNode } from '../../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from '../../assets/wise5/authoringTool/addNode/choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from '../../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { CardSelectorComponent } from '../../assets/wise5/authoringTool/components/card-selector/card-selector.component';
import { RequiredErrorLabelComponent } from '../../assets/wise5/authoringTool/node/advanced/required-error-label/required-error-label.component';
import { RubricAuthoringComponent } from '../../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { NodeIconChooserDialog } from '../../assets/wise5/common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { ChooseNewComponent } from '../authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ChooseImportStepLocationComponent } from '../authoring-tool/import-step/choose-import-step-location/choose-import-step-location.component';
import { ChooseImportStepComponent } from '../authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { ComponentAuthoringModule } from './component-authoring.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { PreviewComponentModule } from '../../assets/wise5/authoringTool/components/preview-component/preview-component.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { AddLessonConfigureComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-configure/add-lesson-configure.component';
import { AddLessonChooseLocationComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-choose-location/add-lesson-choose-location.component';
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

@NgModule({
  declarations: [
    AddLessonChooseLocationComponent,
    AddLessonConfigureComponent,
    AddProjectComponent,
    AddYourOwnNode,
    AdvancedProjectAuthoringComponent,
    AuthoringToolBarComponent,
    CardSelectorComponent,
    ChooseAutomatedAssessmentComponent,
    ChooseComponentLocationComponent,
    ChooseImportStepComponent,
    ChooseImportStepLocationComponent,
    ChooseNewComponent,
    ChooseNewNodeLocation,
    ChooseNewNodeTemplate,
    ChooseSimulationComponent,
    ConcurrentAuthorsMessageComponent,
    ConfigureAutomatedAssessmentComponent,
    MilestonesAuthoringComponent,
    NodeAuthoringComponent,
    NodeIconChooserDialog,
    NotebookAuthoringComponent,
    ProjectInfoAuthoringComponent,
    RecoveryAuthoringComponent,
    RequiredErrorLabelComponent,
    RubricAuthoringComponent,
    TeacherNodeIconComponent,
    TopBarComponent,
    ProjectListComponent
  ],
  imports: [
    StudentTeacherCommonModule,
    ComponentAuthoringModule,
    ComponentStudentModule,
    MatBadgeModule,
    MatChipsModule,
    ImportComponentModule,
    NodeAdvancedAuthoringModule,
    PreviewComponentModule,
    ProjectAssetAuthoringModule,
    RouterModule,
    StepToolsModule,
    StructureAuthoringModule,
    WiseTinymceEditorModule
  ]
})
export class AuthoringToolModule {}
