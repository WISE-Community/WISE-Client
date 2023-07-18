import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Node } from '../../../common/Node';

@Component({
  selector: 'choose-component-location',
  templateUrl: 'choose-component-location.component.html'
})
export class ChooseComponentLocationComponent {
  private action: 'copy' | 'move';
  protected components: any;
  private node: Node;
  private selectedComponents: any[];

  constructor(
    private componentTypeService: ComponentTypeService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.action = this.upgrade.$injector.get('$stateParams').action;
    const nodeId = this.dataService.getCurrentNodeId();
    this.node = this.projectService.getNode(nodeId);
    this.components = this.projectService.getComponents(nodeId);
    this.selectedComponents = this.upgrade.$injector.get('$stateParams').selectedComponents;
  }

  protected getComponentTypeLabel(componentType: any): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  protected insertComponentAfter(insertAfterComponentId: string = null): void {
    const updatedComponents =
      this.action === 'copy'
        ? this.copyComponents(insertAfterComponentId)
        : this.moveComponents(insertAfterComponentId);
    this.projectService.saveProject().then(() => {
      this.goToNodeAuthoring(updatedComponents);
    });
  }

  private copyComponents(insertAfterComponentId: string = null): any[] {
    return this.node.copyComponents(
      this.selectedComponents.map((c) => c.id),
      insertAfterComponentId
    );
  }

  private moveComponents(insertAfterComponentId: string = null): any[] {
    this.node.moveComponents(
      this.selectedComponents.map((c) => c.id),
      insertAfterComponentId
    );
    return this.selectedComponents;
  }

  protected goToNodeAuthoring(components: any[] = []): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.configService.getProjectId(),
      nodeId: this.node.id,
      newComponents: components
    });
  }
}
