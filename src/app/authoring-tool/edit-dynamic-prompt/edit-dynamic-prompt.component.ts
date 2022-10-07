import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-dynamic-prompt',
  templateUrl: './edit-dynamic-prompt.component.html',
  styleUrls: ['./edit-dynamic-prompt.component.scss']
})
export class EditDynamicPromptComponent implements OnInit {
  allowedConnectedComponentTypes: string[] = ['OpenResponse'];
  @Input() authoringComponentContent: any;
  @Output() dynamicPromptChangedEvent = new EventEmitter<string>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {}

  toggleDynamicPrompt(event: any): void {
    if (this.authoringComponentContent.dynamicPrompt == null) {
      this.authoringComponentContent.dynamicPrompt = new DynamicPrompt({
        referenceComponent: {},
        rules: []
      });
    }
    this.authoringComponentContent.dynamicPrompt.enabled = event.checked;
    this.dynamicPromptChangedEvent.next(event);
  }

  referenceComponentNodeIdChanged(event: any): void {
    const dynamicPrompt = this.authoringComponentContent.dynamicPrompt;
    dynamicPrompt.referenceComponent.componentId = null;
    let numberOfAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponentsByNodeId(event.nodeId)) {
      if (this.allowedConnectedComponentTypes.includes(component.type)) {
        numberOfAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    if (numberOfAllowedComponents === 1) {
      dynamicPrompt.referenceComponent.componentId = allowedComponent.id;
    }
    this.dynamicPromptChangedEvent.next(event);
  }
}
