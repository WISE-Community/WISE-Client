import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { MatchStudentModule } from '../../match/match-student/match-student.module';
import { ShowWorkStudentComponent } from './show-work-student.component';

@NgModule({
  declarations: [ShowWorkStudentComponent],
  imports: [MatchStudentModule, AngularJSModule],
  exports: [ShowWorkStudentComponent]
})
export class ShowWorkStudentModule {}
