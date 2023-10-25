import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthoringToolComponent } from '../../assets/wise5/authoringTool/authoring-tool.component';
import { ProjectListComponent } from '../../assets/wise5/authoringTool/project-list/project-list.component';
import { AuthoringConfigResolver } from './authoring.config.resolver';
import { AuthoringProjectResolver } from './authoring.project.resolver';
import { AddProjectComponent } from '../../assets/wise5/authoringTool/add-project/add-project.component';
import { ProjectAuthoringComponent } from '../../assets/wise5/authoringTool/project-authoring/project-authoring.component';
import { NodeAuthoringComponent } from '../../assets/wise5/authoringTool/node/node-authoring/node-authoring.component';
import { NodeAdvancedAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/node-advanced-authoring/node-advanced-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/constraint/node-advanced-constraint-authoring.component';
import { ChooseComponentLocationComponent } from '../../assets/wise5/authoringTool/node/chooseComponentLocation/choose-component-location.component';
import { AddLessonConfigureComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-configure/add-lesson-configure.component';
import { AddLessonChooseLocationComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-choose-location/add-lesson-choose-location.component';
import { ChooseNewNodeTemplate } from '../../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { AddYourOwnNode } from '../../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from '../../assets/wise5/authoringTool/addNode/choose-new-node-location/choose-new-node-location.component';
import { ChooseAutomatedAssessmentComponent } from '../../assets/wise5/authoringTool/addNode/choose-automated-assessment/choose-automated-assessment.component';
import { ConfigureAutomatedAssessmentComponent } from '../../assets/wise5/authoringTool/addNode/configure-automated-assessment/configure-automated-assessment.component';
import { ChooseImportStepLocationComponent } from '../authoring-tool/import-step/choose-import-step-location/choose-import-step-location.component';
import { ChooseSimulationComponent } from '../../assets/wise5/authoringTool/addNode/choose-simulation/choose-simulation.component';
import { ChooseImportStepComponent } from '../authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { EditNodeRubricComponent } from '../../assets/wise5/authoringTool/node/editRubric/edit-node-rubric.component';
import { NodeAdvancedPathAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/path/node-advanced-path-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedBranchAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/branch/node-advanced-branch-authoring.component';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { ProjectInfoAuthoringComponent } from '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component';
import { ProjectAssetAuthoringComponent } from '../../assets/wise5/authoringTool/project-asset-authoring/project-asset-authoring.component';
import { NotebookAuthoringComponent } from '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { ChooseImportComponentComponent } from '../../assets/wise5/authoringTool/importComponent/choose-import-component/choose-import-component.component';
import { ChooseMoveNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component';
import { ChooseCopyNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component';
import { ProjectAuthoringParentComponent } from '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component';
import { ChooseImportUnitComponent } from '../authoring-tool/import-step/choose-import-unit/choose-import-unit.component';
import { NodeAuthoringParentComponent } from '../../assets/wise5/authoringTool/node/node-authoring-parent/node-authoring-parent.component';
import { AddLessonChooseTemplateComponent } from '../../assets/wise5/authoringTool/addLesson/add-lesson-choose-template/add-lesson-choose-template.component';
import { RecoveryAuthoringProjectResolver } from './recovery-authoring-project.resolver';

const routes: Routes = [
  {
    path: '',
    component: AuthoringToolComponent,
    resolve: { config: AuthoringConfigResolver },
    children: [
      { path: 'home', component: ProjectListComponent },
      { path: 'new-unit', component: AddProjectComponent },
      {
        path: 'unit/:unitId/recovery',
        component: ProjectAuthoringParentComponent,
        resolve: { project: RecoveryAuthoringProjectResolver },
        children: [{ path: '', component: RecoveryAuthoringComponent }]
      },
      {
        path: 'unit/:unitId',
        component: ProjectAuthoringParentComponent,
        resolve: { project: AuthoringProjectResolver },
        children: [
          { path: '', component: ProjectAuthoringComponent },
          {
            path: 'add-lesson',
            children: [
              {
                path: '',
                component: AddLessonChooseTemplateComponent
              },
              {
                path: 'configure',
                component: AddLessonConfigureComponent
              },
              {
                path: 'choose-location',
                component: AddLessonChooseLocationComponent
              },
              {
                path: 'structure',
                loadChildren: () =>
                  import(
                    '../../assets/wise5/authoringTool/structure/structure-authoring.module'
                  ).then((m) => m.StructureAuthoringModule)
              }
            ]
          },
          {
            path: 'add-node',
            children: [
              {
                path: 'add-your-own',
                component: AddYourOwnNode
              },
              {
                path: 'automated-assessment',
                children: [
                  {
                    path: 'choose-item',
                    component: ChooseAutomatedAssessmentComponent
                  },
                  { path: 'configure', component: ConfigureAutomatedAssessmentComponent }
                ]
              },
              {
                path: 'choose-template',
                component: ChooseNewNodeTemplate
              },
              {
                path: 'choose-location',
                component: ChooseNewNodeLocation
              },
              {
                path: 'import-step',
                children: [
                  {
                    path: 'choose-location',
                    component: ChooseImportStepLocationComponent
                  },
                  {
                    path: 'choose-step',
                    component: ChooseImportStepComponent
                  },
                  {
                    path: 'choose-unit',
                    component: ChooseImportUnitComponent
                  }
                ]
              },
              {
                path: 'simulation',
                children: [{ path: 'choose-item', component: ChooseSimulationComponent }]
              }
            ]
          },
          { path: 'advanced', component: AdvancedProjectAuthoringComponent },
          {
            path: 'asset',
            component: ProjectAssetAuthoringComponent
          },
          { path: 'choose-copy-location', component: ChooseCopyNodeLocationComponent },
          { path: 'choose-move-location', component: ChooseMoveNodeLocationComponent },
          { path: 'info', component: ProjectInfoAuthoringComponent },
          { path: 'milestones', component: MilestonesAuthoringComponent },
          {
            path: 'node/:nodeId',
            component: NodeAuthoringParentComponent,
            children: [
              {
                path: '',
                component: NodeAuthoringComponent
              },
              {
                path: 'advanced',
                component: NodeAdvancedAuthoringComponent,
                children: [
                  { path: 'branch', component: NodeAdvancedBranchAuthoringComponent },
                  { path: 'constraint', component: NodeAdvancedConstraintAuthoringComponent },
                  { path: 'general', component: NodeAdvancedGeneralAuthoringComponent },
                  { path: 'json', component: NodeAdvancedJsonAuthoringComponent },
                  { path: 'path', component: NodeAdvancedPathAuthoringComponent },
                  { path: 'rubric', component: EditNodeRubricComponent }
                ]
              },
              {
                path: 'choose-component-location',
                component: ChooseComponentLocationComponent
              },
              {
                path: 'import-component',
                children: [{ path: 'choose-component', component: ChooseImportComponentComponent }]
              }
            ]
          },
          { path: 'notebook', component: NotebookAuthoringComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringRoutingModule {}
