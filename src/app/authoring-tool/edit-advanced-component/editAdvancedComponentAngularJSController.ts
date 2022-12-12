import { NodeService } from '../../../assets/wise5/services/nodeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

export class EditAdvancedComponentAngularJSController {
  componentContent: any;
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
    this.componentContent = this.ProjectService.getComponent(this.nodeId, this.componentId);
    this.idToOrder = this.ProjectService.idToOrder;
  }

  componentChanged(): void {
    this.ProjectService.nodeChanged();
  }

  setShowSubmitButtonValue(show: boolean): void {
    if (show == null || show == false) {
      this.componentContent.showSaveButton = false;
      this.componentContent.showSubmitButton = false;
    } else {
      this.componentContent.showSaveButton = true;
      this.componentContent.showSubmitButton = true;
    }
    this.NodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.componentContent.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  maxSubmitCountChanged(maxSubmitCount: number): void {
    this.componentChanged();
  }
}
