import { ConfigService } from '../../../services/configService';
import { ImportComponentService } from '../../../services/importComponentService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { Component, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'choose-import-component-location',
  templateUrl: './choose-import-component-location.component.html',
  styleUrls: ['./choose-import-component-location.component.scss']
})
export class ChooseImportComponentLocationComponent implements OnInit {
  components: any = [];
  nodeId: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    private configService: ConfigService,
    private importComponentService: ImportComponentService,
    private projectAssetService: ProjectAssetService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit() {
    this.nodeId = this.dataService.getCurrentNodeId();
    this.components = this.projectService.getComponents(this.nodeId);
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  insertComponentAsFirst(): void {
    this.importComponentAfter(null);
  }

  importComponentAfter(insertAfterComponentId: string): void {
    this.importComponentService
      .importComponents(
        this.upgrade.$injector.get('$stateParams').selectedComponents,
        this.upgrade.$injector.get('$stateParams').importFromProjectId,
        this.nodeId,
        insertAfterComponentId
      )
      .then((newComponents) => {
        this.saveImportedComponentsEvent(newComponents);
        this.projectService.saveProject();
        // refresh the project assets in case any of the imported components also imported assets
        this.projectAssetService.retrieveProjectAssets();
        this.upgrade.$injector.get('$state').go('root.at.project.node', {
          projectId: this.configService.getProjectId(),
          nodeId: this.nodeId,
          newComponents: newComponents
        });
      });
  }

  private saveImportedComponentsEvent(newComponents: any): void {
    const importedComponents = this.getImportedComponents();
    for (let c = 0; c < importedComponents.length; c++) {
      importedComponents[c].toComponentId = newComponents[c].id;
    }
    this.dataService.saveEvent(
      'AuthoringTool',
      this.nodeId,
      null,
      null,
      'Authoring',
      'componentImported',
      { componentsImported: importedComponents }
    );
  }

  private getImportedComponents(): any[] {
    const importedComponents = [];
    for (const component of this.upgrade.$injector.get('$stateParams').selectedComponents) {
      const importedComponent = {
        fromProjectId: this.upgrade.$injector.get('$stateParams').importFromProjectId,
        fromComponentId: component.id,
        type: component.type
      };
      importedComponents.push(importedComponent);
    }
    return importedComponents;
  }

  cancel(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.configService.getProjectId(),
      nodeId: this.dataService.getCurrentNodeId()
    });
  }
}
