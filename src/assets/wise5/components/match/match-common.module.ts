import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { DeleteChoiceButton } from './delete-choice-button/delete-choice-button.component';
import { MatchChoiceItem } from './match-choice-item/match-choice-item.component';
import { MatchStatusIcon } from './match-status-icon/match-status-icon.component';
import { MatchFeedbackSection } from './match-student/match-feedback-section/match-feedback-section.component';

@NgModule({
  declarations: [
    DeleteChoiceButton,
    MatchChoiceItem,
    MatchFeedbackSection,
    MatchStatusIcon
  ],
  imports: [AngularJSModule],
  exports: [
    DeleteChoiceButton,
    MatchChoiceItem,
    MatchFeedbackSection,
    MatchStatusIcon
  ]
})
export class MatchCommonModule {}
