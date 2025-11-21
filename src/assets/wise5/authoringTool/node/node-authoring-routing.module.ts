import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NodeAuthoringParentComponent } from './node-authoring-parent/node-authoring-parent.component';
import { NodeAuthoringComponent } from './node-authoring/node-authoring.component';

const routes: Routes = [
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
        loadChildren: () =>
          import('./advanced/node-advanced-routing.module').then((m) => m.NodeAdvancedRoutingModule)
      },
      {
        path: 'import-component',
        loadChildren: () =>
          import('../importComponent/import-component.routes').then((m) => m.routes)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class NodeAuthoringRoutingModule {}
