import { ConfigService } from '../../services/configService';
import { ImportComponentService } from '../../services/importComponentService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { ComponentTypeService } from '../../services/componentTypeService';

class ChooseComponentLocationController {
  components: any = [];
  nodeId: string;

  static $inject = [
    '$state',
    '$stateParams',
    'ComponentTypeService',
    'ConfigService',
    'ImportComponentService',
    'ProjectAssetService',
    'ProjectService',
    'TeacherDataService'
  ];

  constructor(
    private $state: any,
    private $stateParams: any,
    private componentTypeService: ComponentTypeService,
    private ConfigService: ConfigService,
    private ImportComponentService: ImportComponentService,
    private ProjectAssetService: ProjectAssetService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  $onInit() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.components = this.ProjectService.getComponents(this.nodeId);
  }

  getComponentTypeLabel(componentType) {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  insertComponentAsFirst() {
    this.importComponentAfter(null);
  }

  importComponentAfter(insertAfterComponentId: string) {
    this.ImportComponentService.importComponents(
      this.$stateParams.selectedComponents,
      this.$stateParams.importFromProjectId,
      this.nodeId,
      insertAfterComponentId
    ).then((newComponents) => {
      this.saveImportedComponentsEvent(newComponents);
      this.ProjectService.saveProject();
      // refresh the project assets in case any of the imported components also imported assets
      this.ProjectAssetService.retrieveProjectAssets();
      this.$state.go('root.at.project.node', {
        projectId: this.ConfigService.getProjectId(),
        nodeId: this.nodeId,
        newComponents: newComponents
      });
    });
  }

  saveImportedComponentsEvent(newComponents: any) {
    const importedComponents = this.getImportedComponents();
    for (let c = 0; c < importedComponents.length; c++) {
      importedComponents[c].toComponentId = newComponents[c].id;
    }
    this.TeacherDataService.saveEvent(
      'AuthoringTool',
      this.nodeId,
      null,
      null,
      'Authoring',
      'componentImported',
      { componentsImported: importedComponents }
    );
  }

  getImportedComponents() {
    const importedComponents = [];
    for (const component of this.$stateParams.selectedComponents) {
      const importedComponent = {
        fromProjectId: this.$stateParams.importFromProjectId,
        fromComponentId: component.id,
        type: component.type
      };
      importedComponents.push(importedComponent);
    }
    return importedComponents;
  }

  cancel() {
    this.$state.go('root.at.project.node', {
      projectId: this.ConfigService.getProjectId(),
      nodeId: this.TeacherDataService.getCurrentNodeId()
    });
  }
}

export const ChooseComponentLocation = {
  templateUrl: `/assets/wise5/authoringTool/importComponent/choose-component-location.component.html`,
  controller: ChooseComponentLocationController
};
