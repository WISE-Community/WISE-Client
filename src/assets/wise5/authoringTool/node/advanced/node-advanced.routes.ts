import { Routes } from '@angular/router';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring/node-advanced-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from './constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from './general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from './json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from './path/node-advanced-path-authoring.component';
import { EditNodeRubricComponent } from '../editRubric/edit-node-rubric.component';

export const routes: Routes = [
  {
    path: '',
    component: NodeAdvancedAuthoringComponent,
    children: [
      { path: 'constraint', component: NodeAdvancedConstraintAuthoringComponent },
      { path: 'general', component: NodeAdvancedGeneralAuthoringComponent },
      { path: 'json', component: NodeAdvancedJsonAuthoringComponent },
      { path: 'path', component: NodeAdvancedPathAuthoringComponent },
      { path: 'rubric', component: EditNodeRubricComponent }
    ]
  }
];
