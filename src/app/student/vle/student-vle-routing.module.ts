import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VLEComponent } from '../../../assets/wise5/vle/vle.component';

const routes: Routes = [
  {
    path: '',
    component: VLEComponent
  },
  {
    path: ':nodeId',
    component: VLEComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentVLERoutingModule {}
