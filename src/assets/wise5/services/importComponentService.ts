import { Injectable } from '@angular/core';
import { copy } from '../common/object/object';
import { ConfigService } from './configService';
import { CopyNodesService } from './copyNodesService';
import { InsertComponentService } from './insertComponentService';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class ImportComponentService {
  constructor(
    protected ConfigService: ConfigService,
    protected CopyNodesService: CopyNodesService,
    protected InsertComponentService: InsertComponentService,
    protected ProjectService: TeacherProjectService
  ) {}

  /**
   * Import components from a project. Also import asset files that are
   * referenced in any of those components.
   * @param components an array of component objects that we are importing
   * @param importProjectId the id of the project we are importing from
   * @param nodeId the node we are adding the components to
   * @param insertAfterComponentId insert the components after this component id
   * @return an array of the new components
   */
  importComponents(
    components: any[],
    importProjectId: number,
    nodeId: string,
    insertAfterComponentId: string
  ) {
    const newComponents = [];
    const newComponentIds = [];
    for (const component of components) {
      const newComponent = copy(component);
      let newComponentId = newComponent.id;
      if (this.ProjectService.isComponentIdUsed(newComponentId)) {
        newComponentId = this.ProjectService.getUnusedComponentId(newComponentIds);
        newComponent.id = newComponentId;
      }
      newComponents.push(newComponent);
      newComponentIds.push(newComponentId);
    }

    return this.CopyNodesService.copyNodes(
      newComponents,
      importProjectId,
      this.ConfigService.getConfigParam('projectId')
    )
      .toPromise()
      .then((newComponents: any) => {
        this.InsertComponentService.insertComponents(newComponents, nodeId, insertAfterComponentId);
        return newComponents;
      });
  }
}
