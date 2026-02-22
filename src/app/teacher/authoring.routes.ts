import { Routes } from '@angular/router';
import { AuthoringConfigResolver } from './authoring.config.resolver';
import { AuthoringProjectResolver } from './authoring.project.resolver';
import { RecoveryAuthoringProjectResolver } from './recovery-authoring-project.resolver';

export const authoringRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../assets/wise5/authoringTool/authoring-tool.component').then(
        (m) => m.AuthoringToolComponent
      ),
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
        loadComponent: () =>
          import(
            '../../assets/wise5/authoringTool/recovery-authoring/recovery-authoring.component'
          ).then((m) => m.RecoveryAuthoringComponent),
        resolve: { project: RecoveryAuthoringProjectResolver }
      },
      {
        path: 'unit/:unitId',
        loadComponent: () =>
          import(
            '../../assets/wise5/authoringTool/project-authoring-parent/project-authoring-parent.component'
          ).then((m) => m.ProjectAuthoringParentComponent),
        resolve: { project: AuthoringProjectResolver },
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/project-authoring/project-authoring.component'
              ).then((m) => m.ProjectAuthoringComponent)
          },
          {
            path: 'add-lesson',
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/addLesson/add-lesson.routes').then(
                (m) => m.routes
              )
          },
          {
            path: 'add-node',
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/addNode/add-node.routes').then(
                (m) => m.routes
              )
          },
          {
            path: 'create-branch',
            loadComponent: () =>
              import('../../assets/wise5/authoringTool/create-branch/create-branch.component').then(
                (m) => m.CreateBranchComponent
              )
          },
          {
            path: 'advanced',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component'
              ).then((m) => m.AdvancedProjectAuthoringComponent)
          },
          {
            path: 'asset',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/project-asset-authoring/project-asset-authoring.component'
              ).then((m) => m.ProjectAssetAuthoringComponent)
          },
          {
            path: 'choose-copy-location',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/choose-node-location/choose-copy-node-location/choose-copy-node-location.component'
              ).then((m) => m.ChooseCopyNodeLocationComponent)
          },
          {
            path: 'choose-move-location',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/choose-node-location/choose-move-node-location/choose-move-node-location.component'
              ).then((m) => m.ChooseMoveNodeLocationComponent)
          },
          {
            path: 'edit-branch',
            loadComponent: () =>
              import('../../assets/wise5/authoringTool/edit-branch/edit-branch.component').then(
                (m) => m.EditBranchComponent
              )
          },
          {
            path: 'info',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/project-info-authoring/project-info-authoring.component'
              ).then((m) => m.ProjectInfoAuthoringComponent)
          },
          {
            path: 'milestones',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/milestones-authoring/milestones-authoring.component'
              ).then((m) => m.MilestonesAuthoringComponent)
          },
          {
            path: 'node/:nodeId',
            loadChildren: () =>
              import('../../assets/wise5/authoringTool/node/node-authoring.routes').then(
                (m) => m.routes
              )
          },
          {
            path: 'notebook',
            loadComponent: () =>
              import(
                '../../assets/wise5/authoringTool/notebook-authoring/notebook-authoring.component'
              ).then((m) => m.NotebookAuthoringComponent)
          }
        ]
      }
    ]
  }
];
