import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-connected-components',
  templateUrl: './edit-connected-components.component.html',
  styleUrls: ['./edit-connected-components.component.scss']
})
export class EditConnectedComponentsComponent implements OnInit {
  @Input() componentContent: any;
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() allowedConnectedComponentTypes: string[] = [];
  @Input() connectedComponents: any[] = [];
  @Output() connectedComponentsChanged: EventEmitter<any> = new EventEmitter();
  nodeIds: string[];

  constructor(protected ProjectService: ProjectService) {}

  ngOnInit(): void {
    if (this.connectedComponents == null) {
      this.connectedComponents = [];
    }
  }

  addConnectedComponent(): void {
    this.connectedComponents.push(this.createConnectedComponent());
    this.connectedComponentChanged();
  }

  createConnectedComponent(): any {
    return {
      nodeId: this.nodeId,
      componentId: null,
      type: null
    };
  }

  connectedComponentNodeIdChanged(connectedComponent: any): void {
    this.connectedComponentChanged();
  }

  connectedComponentComponentIdChanged(connectedComponent: any): void {
    this.automaticallySetConnectedComponentTypeIfPossible(connectedComponent);
    this.afterComponentIdChanged(connectedComponent);
    this.connectedComponentChanged();
  }

  automaticallySetConnectedComponentTypeIfPossible(connectedComponent: any): void {
    if (connectedComponent.componentId != null && connectedComponent.type == null) {
      connectedComponent.type = 'importWork';
    }
    this.automaticallySetConnectedComponentFieldsIfPossible(connectedComponent);
  }

  afterComponentIdChanged(connectedComponent: any): void {}

  connectedComponentTypeChanged(connectedComponent: any): void {
    this.connectedComponentChanged();
  }

  isConnectedComponentTypeAllowed(componentType: string): boolean {
    return this.allowedConnectedComponentTypes.includes(componentType);
  }

  automaticallySetConnectedComponentFieldsIfPossible(connectedComponent: any): void {}

  deleteConnectedComponent(index: number): void {
    if (confirm($localize`Are you sure you want to delete this connected component?`)) {
      this.connectedComponents.splice(index, 1);
      this.connectedComponentChanged();
    }
  }

  connectedComponentChanged(): void {
    this.connectedComponentsChanged.emit(this.connectedComponents);
  }

  getComponents(nodeId: string): any[] {
    return this.ProjectService.getComponents(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.ProjectService.getNodePositionAndTitle(nodeId);
  }

  getConnectedComponentType(connectedComponent: any): string {
    const component: any = this.ProjectService.getComponent(
      connectedComponent.nodeId,
      connectedComponent.componentId
    );
    if (component != null) {
      return component.type;
    }
    return null;
  }

  connectedComponentTypeIsSpecificType(connectedComponent: any, componentType: string): boolean {
    return this.getConnectedComponentType(connectedComponent) === componentType;
  }
}
