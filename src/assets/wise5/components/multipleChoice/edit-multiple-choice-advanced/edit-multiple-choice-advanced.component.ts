import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

class EditMultipleChoiceAdvancedController extends EditAdvancedComponentAngularJSController {
  allowedConnectedComponentTypes = ['MultipleChoice'];

  static $inject = ['NodeService', 'ProjectService', 'UtilService'];

  constructor(
    protected NodeService: NodeService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(NodeService, ProjectService);
  }
}

export const EditMultipleChoiceAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditMultipleChoiceAdvancedController,
  templateUrl:
    'assets/wise5/components/multipleChoice/edit-multiple-choice-advanced/edit-multiple-choice-advanced.component.html'
};
