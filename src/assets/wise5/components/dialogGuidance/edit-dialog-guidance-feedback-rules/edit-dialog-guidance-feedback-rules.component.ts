import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'edit-dialog-guidance-feedback-rules',
  templateUrl: './edit-dialog-guidance-feedback-rules.component.html',
  styleUrls: ['./edit-dialog-guidance-feedback-rules.component.scss']
})
export class EditDialogGuidanceFeedbackRulesComponent implements OnInit {
  @Input()
  feedbackRules: any;

  constructor() {}

  ngOnInit(): void {}
}
