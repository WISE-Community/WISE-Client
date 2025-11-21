import { Routes } from '@angular/router';
import { NodeAuthoringParentComponent } from './node-authoring-parent/node-authoring-parent.component';
import { NodeAuthoringComponent } from './node-authoring/node-authoring.component';

export const routes: Routes = [
  {
    path: '',
    component: NodeAuthoringParentComponent,
    children: [
      {
        path: '',
        component: NodeAuthoringComponent
      },
      {
        path: 'advanced',
        loadChildren: () => import('./advanced/node-advanced.routes').then((m) => m.routes)
      },
      {
        path: 'import-component',
        loadChildren: () =>
          import('../importComponent/import-component.routes').then((m) => m.routes)
      }
    ]
  }
];
