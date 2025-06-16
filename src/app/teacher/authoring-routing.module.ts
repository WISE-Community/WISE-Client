import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthoringToolComponent } from '../../assets/wise5/authoringTool/authoring-tool.component';
import { AuthoringConfigResolver } from './authoring.config.resolver';
import { AuthoringProjectResolver } from './authoring.project.resolver';
import { ProjectAuthoringComponent } from '../../assets/wise5/authoringTool/project-authoring/project-authoring.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { MilestonesAuthoringComponent } from '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component';
import { ProjectInfoAuthoringComponent } from '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component';
import { NotebookAuthoringComponent } from '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component';
import { RecoveryAuthoringComponent } from '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component';
import { ChooseMoveNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component';
import { ChooseCopyNodeLocationComponent } from '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component';
import { ProjectAuthoringParentComponent } from '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component';
import { RecoveryAuthoringProjectResolver } from './recovery-authoring-project.resolver';

const routes: Routes = [
  {
    path: '',
    component: AuthoringToolComponent,
    resolve: { config: AuthoringConfigResolver },
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../../assets/wise5/authoringTool/project-list/project-list.component').then(
            (m) => m.ProjectListComponent
          )
      },
      {
        path: 'new-unit',
        loadComponent: () =>
          import('../../assets/wise5/authoringTool/add-project/add-project.component').then(
            (m) => m.AddProjectComponent
          )
      },
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
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/node/node-authoring-routing.module').then(
                (m) => m.NodeAuthoringRoutingModule
              )
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
