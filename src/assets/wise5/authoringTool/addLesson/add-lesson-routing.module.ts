import { RouterModule, Routes } from '@angular/router';
import { AddLessonChooseTemplateComponent } from './add-lesson-choose-template/add-lesson-choose-template.component';
import { AddLessonConfigureComponent } from './add-lesson-configure/add-lesson-configure.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AddLessonChooseTemplateComponent
  },
  {
    path: 'configure',
    component: AddLessonConfigureComponent
  },
  {
    path: 'structure',
    loadChildren: () =>
      import(
        '../../../../assets/wise5/authoringTool/structure/structure-authoring-routing.module'
      ).then((m) => m.StructureAuthoringRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AddLessonRoutingModule {}
