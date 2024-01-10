import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ReferenceComponent } from '../../domain/referenceComponent';

@Component({
  selector: 'select-step-and-component',
  templateUrl: './select-step-and-component.component.html',
  styleUrls: ['./select-step-and-component.component.scss']
})
export class SelectStepAndComponentComponent implements OnInit {
  @Input() allowedComponentTypes: string[] = [];
  @Output() componentChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  protected components: any[] = [];
  protected componentToIsAllowed: Map<string, boolean> = new Map<string, boolean>();
  protected nodeIds: string[] = [];
  protected nodeToPositionAndTitle: Map<string, string> = new Map<string, string>();
  @Input() referenceComponent: ReferenceComponent;
  @Output() stepChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  @Input() thisComponentId: string;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getStepNodeIds();
    this.calculateNodePositionAndTitles(this.nodeIds);
    if (this.referenceComponent.nodeId != null) {
      this.calculateComponents(this.referenceComponent.nodeId);
      if (this.referenceComponent.componentId == null) {
        this.automaticallySetComponentIfPossible(this.referenceComponent.nodeId);
      }
    }
  }

  private calculateNodePositionAndTitles(nodeIds: string[]): void {
    for (const nodeId of nodeIds) {
      this.nodeToPositionAndTitle.set(nodeId, this.projectService.getNodePositionAndTitle(nodeId));
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

  stepChanged(nodeId: string): void {
    this.referenceComponent.componentId = null;
    this.automaticallySetComponentIfPossible(nodeId);
    this.calculateComponents(nodeId);
    this.stepChange.emit(this.referenceComponent);
  }

  protected componentChanged(): void {
    this.componentChange.emit(this.referenceComponent);
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
      this.referenceComponent.componentId = allowedComponent.id;
      this.componentChanged();
    }
  }
}
