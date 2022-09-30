import { Component, Input, OnInit } from '@angular/core';
import { DynamicPrompt } from './DynamicPrompt';

@Component({
  selector: 'dynamic-prompt',
  templateUrl: './dynamic-prompt.component.html',
  styleUrls: ['./dynamic-prompt.component.scss']
})
export class DynamicPromptComponent implements OnInit {
  @Input() dynamicPrompt: DynamicPrompt;

  constructor() {}

  ngOnInit(): void {}
}
