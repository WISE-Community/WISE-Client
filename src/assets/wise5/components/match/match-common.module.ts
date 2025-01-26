import { DeleteChoiceButtonComponent } from './delete-choice-button/delete-choice-button.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatchChoiceItemComponent } from './match-choice-item/match-choice-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatchStatusIconComponent } from './match-status-icon/match-status-icon.component';
import { MatchFeedbackSectionComponent } from './match-student/match-feedback-section/match-feedback-section.component';

@NgModule({
  imports: [
    CommonModule,
    DeleteChoiceButtonComponent,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatchChoiceItemComponent,
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
    DeleteChoiceButtonComponent,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatchChoiceItemComponent,
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
