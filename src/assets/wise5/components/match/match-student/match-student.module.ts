import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { AddChoiceButton } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialog } from './add-match-choice-dialog/add-match-choice-dialog';
import { DeleteChoiceButton } from './delete-choice-button/delete-choice-button.component';
import { MatchChoiceItem } from './match-choice-item/match-choice-item.component';
import { MatchFeedbackSection } from './match-feedback-section/match-feedback-section.component';
import { MatchStatusIcon } from './match-status-icon/match-status-icon.component';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';

@NgModule({
  declarations: [
    AddChoiceButton,
    AddMatchChoiceDialog,
    DeleteChoiceButton,
    MatchChoiceItem,
    MatchFeedbackSection,
    MatchStatusIcon,
    MatchStudent
  ],
  imports: [AngularJSModule, StudentComponentModule]
})
export class MatchStudentModule {}
