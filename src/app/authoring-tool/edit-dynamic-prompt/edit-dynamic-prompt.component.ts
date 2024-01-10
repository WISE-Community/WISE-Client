import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-dynamic-prompt',
  templateUrl: './edit-dynamic-prompt.component.html',
  styleUrls: ['./edit-dynamic-prompt.component.scss']
})
export class EditDynamicPromptComponent implements OnInit {
  allowedReferenceComponentTypes: string[] = ['OpenResponse'];
  @Input() componentContent: any;
  @Output() dynamicPromptChangedEvent = new EventEmitter();

  constructor(private projectService: ProjectService) {}

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

  referenceComponentNodeIdChanged(event: any): void {
    let numAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponents(event.nodeId)) {
      if (this.allowedReferenceComponentTypes.includes(component.type)) {
        numAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    const dynamicPrompt = this.componentContent.dynamicPrompt;
    if (numAllowedComponents === 1) {
      dynamicPrompt.referenceComponent.componentId = allowedComponent.id;
    } else {
      dynamicPrompt.referenceComponent.componentId = null;
    }
    this.dynamicPromptChangedEvent.next();
  }
}
