import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';

@Component({
  selector: 'select-component',
  templateUrl: './select-component.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule]
})
export class SelectComponentComponent {
  @Input() allowedComponentTypes: string[] = [];
  @Output() componentChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() componentId: string;
  protected components: ComponentContent[] = [];
  protected componentToIsAllowed: Map<string, boolean> = new Map<string, boolean>();
  @Input() nodeId: string;
  @Input() thisComponentId: string;

  constructor(private projectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodeId) {
      this.nodeId = changes.nodeId.currentValue;
      this.componentId = null;
      this.calculateComponents(this.nodeId);
      this.automaticallySetComponentIfPossible(this.nodeId);
    }
  }

  private calculateComponents(nodeId: string): void {
    this.components = this.projectService.getComponents(nodeId);
    for (const component of this.components) {
      this.componentToIsAllowed.set(
        component.id,
        this.allowedComponentTypes.includes(component.type)
      );
    }
  }

  private automaticallySetComponentIfPossible(nodeId: string): void {
    let numAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponents(nodeId)) {
      if (
        this.allowedComponentTypes.includes(component.type) &&
        component.id !== this.thisComponentId
      ) {
        numAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    if (numAllowedComponents === 1) {
      this.componentId = allowedComponent.id;
      this.componentChanged();
    }
  }

  protected componentChanged(): void {
    this.componentChangedEvent.emit(this.componentId);
  }
}
