import { Routes } from '@angular/router';
import { AddLessonChooseTemplateComponent } from './add-lesson-choose-template/add-lesson-choose-template.component';
import { AddLessonConfigureComponent } from './add-lesson-configure/add-lesson-configure.component';

export const routes: Routes = [
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
    loadChildren: () => import('../structure/structure-authoring.routes').then((m) => m.routes)
  }
];
