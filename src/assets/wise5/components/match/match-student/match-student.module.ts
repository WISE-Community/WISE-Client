import { NgModule } from '@angular/core';
import { AddChoiceButton } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialog } from './add-match-choice-dialog/add-match-choice-dialog';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MatchCommonModule } from '../match-common.module';

@NgModule({
  declarations: [AddChoiceButton, AddMatchChoiceDialog, MatchStudent],
  imports: [MatchCommonModule, StudentComponentModule],
  exports: [MatchStudent]
})
export class MatchStudentModule {}
