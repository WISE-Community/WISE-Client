import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MultipleChoiceStudent } from './multiple-choice-student.component';

@NgModule({
  declarations: [MultipleChoiceStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [MultipleChoiceStudent]
})
export class MultipleChoiceStudentModule {}
