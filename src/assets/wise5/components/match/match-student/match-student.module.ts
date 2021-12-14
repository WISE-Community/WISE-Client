import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { AddChoiceButton } from './add-choice-button/add-choice-button.component';
import { AddMatchChoiceDialog } from './add-match-choice-dialog/add-match-choice-dialog';
import { MatchFeedbackSection } from './match-feedback-section/match-feedback-section.component';
import { MatchStudent } from './match-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MatchCommonModule } from '../match-common.module';

@NgModule({
  declarations: [
    AddChoiceButton,
    AddMatchChoiceDialog,
    MatchFeedbackSection,
    MatchStudent
  ],
  imports: [AngularJSModule, MatchCommonModule, StudentComponentModule]
})
export class MatchStudentModule {} 
