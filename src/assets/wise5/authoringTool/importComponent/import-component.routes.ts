import { Routes } from '@angular/router';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';
import { ChooseImportUnitComponent } from '../../../../app/authoring-tool/import-step/choose-import-unit/choose-import-unit.component';

export const routes: Routes = [
  {
    path: 'choose-component',
    component: ChooseImportComponentComponent
  },
  {
    path: 'choose-unit',
    component: ChooseImportUnitComponent
  }
];
