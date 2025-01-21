import { NgModule } from '@angular/core';
import { AddChoiceButton } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialogComponent } from './add-match-choice-dialog/add-match-choice-dialog';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MatchCommonModule } from '../match-common.module';
import { MatchStudentChoiceReuse } from './match-student-choice-reuse/match-student-choice-reuse';
import { MatchStudentDefault } from './match-student-default/match-student-default.component';

@NgModule({
  declarations: [AddChoiceButton, MatchStudent, MatchStudentDefault, MatchStudentChoiceReuse],
  imports: [MatchCommonModule, StudentComponentModule, AddMatchChoiceDialogComponent],
  exports: [MatchStudent, AddMatchChoiceDialogComponent]
})
export class MatchStudentModule {}
