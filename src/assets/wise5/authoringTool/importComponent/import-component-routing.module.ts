import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';
import { ChooseImportUnitComponent } from '../../../../app/authoring-tool/import-step/choose-import-unit/choose-import-unit.component';

const routes: Routes = [
  {
    path: 'choose-component',
    component: ChooseImportComponentComponent
  },
  {
    path: 'choose-unit',
    component: ChooseImportUnitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ImportComponentRoutingModule {}
