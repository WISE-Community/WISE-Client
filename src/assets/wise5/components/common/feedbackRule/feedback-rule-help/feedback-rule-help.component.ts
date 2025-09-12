import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  styleUrl: './feedback-rule-help.component.scss',
  templateUrl: './feedback-rule-help.component.html'
})
export class FeedbackRuleHelpComponent {}
