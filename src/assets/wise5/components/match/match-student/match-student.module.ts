import { NgModule } from '@angular/core';
import { AddChoiceButtonComponent } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialog } from './add-match-choice-dialog/add-match-choice-dialog';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MatchCommonModule } from '../match-common.module';
import { MatchStudentChoiceReuse } from './match-student-choice-reuse/match-student-choice-reuse';
import { MatchStudentDefault } from './match-student-default/match-student-default.component';

@NgModule({
  declarations: [ 
    AddMatchChoiceDialog,
    MatchStudent,
    MatchStudentDefault,
    MatchStudentChoiceReuse
  ],
  imports: [
    AddChoiceButtonComponent, 
    MatchCommonModule, 
    StudentComponentModule
  ],
  exports: [MatchStudent]
})
export class MatchStudentModule {}
