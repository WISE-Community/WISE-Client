import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ConceptMapStudent } from './concept-map-student.component';

@NgModule({
  declarations: [ConceptMapStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [ConceptMapStudent]
})
export class ConceptMapStudentModule {}
