import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatchChoiceItem } from './match-choice-item/match-choice-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteChoiceButton } from './delete-choice-button/delete-choice-button.component';
import { MatchStatusIconComponent } from './match-status-icon/match-status-icon.component';
import { MatchFeedbackSectionComponent } from './match-student/match-feedback-section/match-feedback-section.component';

@NgModule({
  declarations: [DeleteChoiceButton],
  imports: [
    CommonModule,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatchChoiceItem,
    MatchFeedbackSectionComponent,
    MatchStatusIconComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    DeleteChoiceButton,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatchChoiceItem,
    MatchFeedbackSectionComponent,
    MatchStatusIconComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ]
})
export class MatchCommonModule {}
