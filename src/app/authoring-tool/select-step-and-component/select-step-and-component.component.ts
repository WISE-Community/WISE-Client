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
  @Output() componentChange: EventEmitter<any> = new EventEmitter();
  protected nodeIds: string[] = [];
  @Input() referenceComponent: ReferenceComponent;
  @Output() stepChange: EventEmitter<any> = new EventEmitter();
  @Input() thisComponentId: string;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    if (this.referenceComponent.nodeId != null && this.referenceComponent.componentId == null) {
      this.automaticallySetComponentIfPossible(this.referenceComponent.nodeId);
    }
  }

  protected isApplicationNode(nodeId: string): boolean {
    return this.projectService.isApplicationNode(nodeId);
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected stepChanged(nodeId: string): void {
    this.referenceComponent.componentId = null;
    this.automaticallySetComponentIfPossible(nodeId);
    this.stepChange.emit(this.referenceComponent);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected isComponentTypeAllowed(componentType: string): boolean {
    return this.allowedComponentTypes.includes(componentType);
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
