import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'choose-new-component-location',
  templateUrl: 'choose-new-component-location.component.html'
})
export class ChooseNewComponentLocation {
  components: any;
  nodeId: string;

  constructor(
    private upgrade: UpgradeModule,
    private componentTypeService: ComponentTypeService,
    private ConfigService: ConfigService,
    private TeacherProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.components = this.TeacherProjectService.getComponents(this.nodeId);
  }

  getComponentTypeLabel(componentType) {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  insertComponentAsFirst() {
    this.insertComponentAfter(null);
  }

  insertComponentAfter(insertAfterComponentId = null) {
    const newComponent = this.TeacherProjectService.createComponent(
      this.nodeId,
      this.upgrade.$injector.get('$stateParams').componentType,
      insertAfterComponentId
    );
    this.TeacherProjectService.saveProject().then(() => {
      this.saveAddComponentEvent(newComponent);
      this.upgrade.$injector.get('$state').go('root.at.project.node', {
        projectId: this.ConfigService.getProjectId(),
        nodeId: this.nodeId,
        newComponents: [newComponent]
      });
    });
  }

  saveAddComponentEvent(newComponent: any) {
    this.TeacherDataService.saveEvent(
      'AuthoringTool',
      this.nodeId,
      null,
      null,
      'Authoring',
      'componentCreated',
      { componentId: newComponent.id, componentType: newComponent.type }
    );
  }

  goToChooseNewComponent() {
    this.upgrade.$injector
      .get('$state')
      .go(
        'root.at.project.node.add-component.choose-component',
        this.upgrade.$injector.get('$stateParams')
      );
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.ConfigService.getProjectId(),
      nodeId: this.nodeId
    });
  }
}
