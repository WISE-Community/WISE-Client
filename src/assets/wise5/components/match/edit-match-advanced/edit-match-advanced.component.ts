import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

class EditMatchAdvancedController extends EditAdvancedComponentAngularJSController {
  allowedConnectedComponentTypes = ['Match'];

  static $inject = ['NodeService', 'NotebookService', 'ProjectService'];

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected ProjectService: TeacherProjectService
  ) {
    super(NodeService, ProjectService);
  }

  isNotebookEnabled(): boolean {
    return this.NotebookService.isNotebookEnabled();
  }

  afterComponentIdChanged(connectedComponent: any): void {
    if (
      confirm(
        $localize`Do you want to copy the choices and buckets from the connected component?\n\nWarning: This will delete all existing choices and buckets in this component.`
      )
    ) {
      const connectedComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
        connectedComponent.nodeId,
        connectedComponent.componentId
      );
      this.authoringComponentContent.choices = connectedComponentContent.choices;
      this.authoringComponentContent.buckets = connectedComponentContent.buckets;
      this.authoringComponentContent.feedback = connectedComponentContent.feedback;
      this.authoringComponentContent.ordered = connectedComponentContent.ordered;
      this.authoringComponentContent.canCreateChoices = connectedComponentContent.canCreateChoices;
      this.authoringComponentContent.importPrivateNotes =
        connectedComponentContent.importPrivateNotes;
    }
  }
}

export const EditMatchAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditMatchAdvancedController,
  templateUrl:
    'assets/wise5/components/match/edit-match-advanced/edit-match-advanced.component.html'
};
