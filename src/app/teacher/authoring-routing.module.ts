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
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { EditNodeRubricComponent } from '../../assets/wise5/authoringTool/node/editRubric/edit-node-rubric.component';
import { NodeAdvancedPathAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/path/node-advanced-path-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { ProjectInfoAuthoringComponent } from '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component';
import { NotebookAuthoringComponent } from '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { ChooseImportComponentComponent } from '../../assets/wise5/authoringTool/importComponent/choose-import-component/choose-import-component.component';
import { ChooseMoveNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component';
import { ChooseCopyNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component';
import { ProjectAuthoringParentComponent } from '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component';
import { ChooseImportUnitComponent } from '../authoring-tool/import-step/choose-import-unit/choose-import-unit.component';
import { NodeAuthoringParentComponent } from '../../assets/wise5/authoringTool/node/node-authoring-parent/node-authoring-parent.component';
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
        path: 'recovery/:unitId',
        component: RecoveryAuthoringComponent,
        resolve: { project: RecoveryAuthoringProjectResolver }
      },
      {
        path: 'unit/:unitId',
        component: ProjectAuthoringParentComponent,
        resolve: { project: AuthoringProjectResolver },
        children: [
          { path: '', component: ProjectAuthoringComponent },
          {
            path: 'add-lesson',
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/addLesson/add-lesson-routing.module').then(
                (m) => m.AddLessonRoutingModule
              )
          },
          {
            path: 'add-node',
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/addNode/add-node-routing.module').then(
                (m) => m.AddNodeRoutingModule
              )
          },
          {
            path: 'create-branch',
            loadComponent: () =>
              import('../../assets/wise5/authoringTool/create-branch/create-branch.component').then(
                (m) => m.CreateBranchComponent
              )
          },
          { path: 'advanced', component: AdvancedProjectAuthoringComponent },
          {
            path: 'asset',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/project-asset-authoring/project-asset-authoring.component'
              ).then((m) => m.ProjectAssetAuthoringComponent)
          },
          { path: 'choose-copy-location', component: ChooseCopyNodeLocationComponent },
          { path: 'choose-move-location', component: ChooseMoveNodeLocationComponent },
          {
            path: 'edit-branch',
            loadComponent: () =>
              import('../../assets/wise5/authoringTool/edit-branch/edit-branch.component').then(
                (m) => m.EditBranchComponent
              )
          },
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
                  { path: 'constraint', component: NodeAdvancedConstraintAuthoringComponent },
                  { path: 'general', component: NodeAdvancedGeneralAuthoringComponent },
                  { path: 'json', component: NodeAdvancedJsonAuthoringComponent },
                  { path: 'path', component: NodeAdvancedPathAuthoringComponent },
                  { path: 'rubric', component: EditNodeRubricComponent }
                ]
              },
              {
                path: 'import-component',
                children: [
                  {
                    path: 'choose-component',
                    component: ChooseImportComponentComponent
                  },
                  {
                    path: 'choose-unit',
                    component: ChooseImportUnitComponent
                  }
                ]
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
