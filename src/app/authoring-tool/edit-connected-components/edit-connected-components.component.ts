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
    this.addConnectedComponentAndSetComponentIdIfPossible();
    this.connectedComponentChanged();
  }

  addConnectedComponentAndSetComponentIdIfPossible(): void {
    const connectedComponent = this.createConnectedComponent();
    this.connectedComponents.push(connectedComponent);
    this.automaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);
  }

  automaticallySetConnectedComponentComponentIdIfPossible(connectedComponent: any): void {
    let numberOfAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.ProjectService.getComponents(connectedComponent.nodeId)) {
      if (
        this.isConnectedComponentTypeAllowed(component.type) &&
        component.id != this.componentId
      ) {
        numberOfAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    if (numberOfAllowedComponents === 1) {
      connectedComponent.componentId = allowedComponent.id;
      connectedComponent.type = 'importWork';
    }
    this.afterComponentIdChanged(connectedComponent);
    this.automaticallySetConnectedComponentTypeIfPossible(connectedComponent);
  }

  afterComponentIdChanged(connectedComponent: any): void {}

  connectedComponentTypeChanged(connectedComponent: any): void {
    this.connectedComponentChanged();
  }

  connectedComponentNodeIdChanged(connectedComponent: any): void {
    connectedComponent.componentId = null;
    connectedComponent.type = null;
    this.automaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);
    this.connectedComponentChanged();
  }

  connectedComponentComponentIdChanged(connectedComponent: any): void {
    this.automaticallySetConnectedComponentTypeIfPossible(connectedComponent);
    this.afterComponentIdChanged(connectedComponent);
    this.connectedComponentChanged();
  }

  isConnectedComponentTypeAllowed(componentType: string): boolean {
    return this.allowedConnectedComponentTypes.includes(componentType);
  }

  automaticallySetConnectedComponentTypeIfPossible(connectedComponent: any): void {
    if (connectedComponent.componentId != null) {
      connectedComponent.type = 'importWork';
    }
    this.automaticallySetConnectedComponentFieldsIfPossible(connectedComponent);
  }

  automaticallySetConnectedComponentFieldsIfPossible(connectedComponent: any): void {}

  createConnectedComponent(): any {
    return {
      nodeId: this.nodeId,
      componentId: null,
      type: null
    };
  }

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
