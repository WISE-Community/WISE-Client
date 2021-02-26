import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';

class EditSummaryAdvancedController extends EditAdvancedComponentAngularJSController {}

export const EditSummaryAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditSummaryAdvancedController,
  templateUrl:
    'assets/wise5/components/summary/edit-summary-advanced/edit-summary-advanced.component.html'
};
