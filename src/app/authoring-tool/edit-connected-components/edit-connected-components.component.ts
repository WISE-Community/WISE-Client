import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentDefaultSelectsComponent } from '../edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../edit-connected-component-delete-button/edit-connected-component-delete-button.component';

@Component({
  imports: [
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentDeleteButtonComponent,
    EditConnectedComponentsAddButtonComponent
  ],
  selector: 'edit-connected-components',
  styleUrl: './edit-connected-components.component.scss',
  templateUrl: './edit-connected-components.component.html'
})
export class EditConnectedComponentsComponent implements OnInit {
  @Input() componentContent: any;
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() allowedConnectedComponentTypes: string[] = [];
  @Input() connectedComponents: any[] = [];
  @Output() connectedComponentsChanged: EventEmitter<any> = new EventEmitter();
  nodeIds: string[];

  constructor(protected projectService: ProjectService) {}

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
    return this.projectService.getComponents(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  getConnectedComponentType(connectedComponent: any): string {
    const component: any = this.projectService.getComponent(
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
