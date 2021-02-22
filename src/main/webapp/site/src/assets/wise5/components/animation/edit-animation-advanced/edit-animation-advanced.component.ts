import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';

class EditAnimationAdvancedController extends EditAdvancedComponentAngularJSController {
  allowedConnectedComponentTypes = ['Animation', 'Graph'];
}

export const EditAnimationAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditAnimationAdvancedController,
  templateUrl:
    'assets/wise5/components/animation/edit-animation-advanced/edit-animation-advanced.component.html'
};
