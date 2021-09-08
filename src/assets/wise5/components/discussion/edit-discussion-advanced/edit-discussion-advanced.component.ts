import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';

class EditDiscussionAdvancedController extends EditAdvancedComponentAngularJSController {
  allowedConnectedComponentTypes = ['Discussion'];
}

export const EditDiscussionAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditDiscussionAdvancedController,
  templateUrl:
    'assets/wise5/components/discussion/edit-discussion-advanced/edit-discussion-advanced.component.html'
};
