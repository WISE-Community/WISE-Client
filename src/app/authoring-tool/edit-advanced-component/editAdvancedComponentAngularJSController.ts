import { NodeService } from '../../../assets/wise5/services/nodeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

export class EditAdvancedComponentAngularJSController {
  authoringComponentContent: any;
  componentId: string;
  nodeId: string;
  allowedConnectedComponentTypes: string[] = [];
  idToOrder: any;

  static $inject = ['NodeService', 'ProjectService'];

  constructor(
    protected NodeService: NodeService,
    protected ProjectService: TeacherProjectService
  ) {}

  $onInit(): void {
    this.authoringComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.idToOrder = this.ProjectService.idToOrder;
  }

  componentChanged(): void {
    this.ProjectService.nodeChanged();
  }

  setShowSubmitButtonValue(show: boolean): void {
    if (show == null || show == false) {
      this.authoringComponentContent.showSaveButton = false;
      this.authoringComponentContent.showSubmitButton = false;
    } else {
      this.authoringComponentContent.showSaveButton = true;
      this.authoringComponentContent.showSubmitButton = true;
    }
    this.NodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.authoringComponentContent.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  maxSubmitCountChanged(maxSubmitCount: number): void {
    this.componentChanged();
  }
}
