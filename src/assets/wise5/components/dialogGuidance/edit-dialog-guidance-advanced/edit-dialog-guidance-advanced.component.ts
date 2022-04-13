import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';

class EditDialogGuidanceAdvancedController extends EditAdvancedComponentAngularJSController {}

export const EditDialogGuidanceAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditDialogGuidanceAdvancedController,
  templateUrl:
    'assets/wise5/components/dialogGuidance/edit-dialog-guidance-advanced/edit-dialog-guidance-advanced.component.html'
};
