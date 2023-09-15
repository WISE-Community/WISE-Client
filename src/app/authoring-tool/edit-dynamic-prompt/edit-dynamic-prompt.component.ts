import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'edit-dynamic-prompt',
  templateUrl: './edit-dynamic-prompt.component.html',
  styleUrls: ['./edit-dynamic-prompt.component.scss']
})
export class EditDynamicPromptComponent implements OnInit {
  protected allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;
  @Output() dynamicPromptChangedEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  toggleDynamicPrompt(event: MatCheckboxChange): void {
    if (this.componentContent.dynamicPrompt == null) {
      this.componentContent.dynamicPrompt = new DynamicPrompt({
        referenceComponent: {},
        rules: []
      });
    }
    this.componentContent.dynamicPrompt.enabled = event.checked;
    this.dynamicPromptChangedEvent.next();
  }
}
