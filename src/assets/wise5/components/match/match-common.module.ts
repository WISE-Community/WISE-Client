import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { DeleteChoiceButton } from './delete-choice-button/delete-choice-button.component';
import { MatchChoiceItem } from './match-choice-item/match-choice-item.component';
import { MatchStatusIcon } from './match-status-icon/match-status-icon.component';

@NgModule({
  declarations: [
    DeleteChoiceButton,
    MatchChoiceItem,
    MatchStatusIcon
  ],
  imports: [AngularJSModule],
  exports: [
    DeleteChoiceButton,
    MatchChoiceItem,
    MatchStatusIcon
  ]
})
export class MatchCommonModule {}
