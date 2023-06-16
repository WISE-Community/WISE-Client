import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { goToNodeAuthoring } from '../../../../assets/wise5/common/ui-router/ui-router';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'choose-new-component',
  styleUrls: ['./choose-new-component.component.scss'],
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  componentTypes: any[];
  selectedComponentType: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit() {
    this.componentTypes = this.componentTypeService.getComponentTypes();
    this.selectedComponentType = this.upgrade.$injector.get('$stateParams').componentType;
  }

  setComponentType(componentType) {
    this.selectedComponentType = componentType;
  }

  next(): void {
    const nodeId = this.dataService.getCurrentNodeId();
    const components = this.projectService.getComponents(nodeId);
    if (components.length === 0) {
      this.insertComponentAsFirst(nodeId, this.selectedComponentType);
    } else {
      this.upgrade.$injector
        .get('$state')
        .go('root.at.project.node.add-component.choose-location', {
          componentType: this.selectedComponentType
        });
    }
  }

  private insertComponentAsFirst(nodeId: string, componentType: string): void {
    const newComponent = this.projectService.createComponent(nodeId, componentType, null);
    this.projectService.saveProject().then(() => {
      this.dataService.saveAddComponentEvent(nodeId, newComponent);
      goToNodeAuthoring(
        this.upgrade.$injector.get('$state'),
        this.configService.getProjectId(),
        nodeId,
        [newComponent]
      );
    });
  }

  protected importComponent(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.import-component.choose-step');
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      nodeId: this.upgrade.$injector.get('$stateParams').nodeId
    });
  }
}
