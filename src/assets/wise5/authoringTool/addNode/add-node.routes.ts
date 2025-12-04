import { Routes } from '@angular/router';
import { AddYourOwnNodeComponent } from './add-your-own-node/add-your-own-node.component';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment/choose-automated-assessment.component';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment/configure-automated-assessment.component';
import { ChooseNewNodeTemplateComponent } from './choose-new-node-template/choose-new-node-template.component';
import { ChooseSimulationComponent } from './choose-simulation/choose-simulation.component';
import { ChooseImportStepComponent } from '../../../../app/authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { ChooseImportUnitComponent } from '../../../../app/authoring-tool/import-step/choose-import-unit/choose-import-unit.component';

export const routes: Routes = [
  {
    path: 'add-your-own',
    component: AddYourOwnNodeComponent
  },
  {
    path: 'automated-assessment',
    children: [
      {
        path: 'choose-item',
        component: ChooseAutomatedAssessmentComponent
      },
      {
        path: 'configure',
        component: ConfigureAutomatedAssessmentComponent
      }
    ]
  },
  {
    path: 'choose-template',
    component: ChooseNewNodeTemplateComponent
  },
  {
    path: 'import-step',
    children: [
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
    children: [
      {
        path: 'choose-item',
        component: ChooseSimulationComponent
      }
    ]
  }
];
