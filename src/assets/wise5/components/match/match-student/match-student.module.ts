import { NgModule } from '@angular/core';
import { AddChoiceButtonComponent } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialogComponent } from './add-match-choice-dialog/add-match-choice-dialog';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MatchCommonModule } from '../match-common.module';
import { MatchStudentChoiceReuseComponent } from './match-student-choice-reuse/match-student-choice-reuse.component';
import { MatchStudentDefaultComponent } from './match-student-default/match-student-default.component';

@NgModule({
  imports: [
    AddChoiceButtonComponent,
    MatchCommonModule,
    MatchStudentChoiceReuseComponent,
    MatchStudentDefaultComponent,
    StudentComponentModule,
    AddMatchChoiceDialogComponent,
    MatchStudent
  ],
  exports: [MatchStudent, MatchStudentDefaultComponent, AddMatchChoiceDialogComponent]
})
export class MatchStudentModule {}
