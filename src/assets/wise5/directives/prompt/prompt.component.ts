import { Component, Input, OnInit } from '@angular/core';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  @Input() prompt: string;
  @Input() dynamicPrompt: DynamicPrompt;

  constructor() {}

  ngOnInit(): void {}
}
