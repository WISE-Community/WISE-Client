import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DeleteChoiceButton } from './delete-choice-button/delete-choice-button.component';
import { MatchChoiceItem } from './match-choice-item/match-choice-item.component';
import { MatchStatusIcon } from './match-status-icon/match-status-icon.component';
import { MatchFeedbackSection } from './match-student/match-feedback-section/match-feedback-section.component';

@NgModule({
  declarations: [DeleteChoiceButton, MatchChoiceItem, MatchFeedbackSection, MatchStatusIcon],
  imports: [
    CommonModule,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    DeleteChoiceButton,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatchChoiceItem,
    MatchFeedbackSection,
    MatchStatusIcon,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class MatchCommonModule {}
