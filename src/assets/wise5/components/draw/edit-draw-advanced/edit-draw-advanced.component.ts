import { EditAdvancedComponentAngularJSController } from '../../../../../app/authoring-tool/edit-advanced-component/editAdvancedComponentAngularJSController';

class EditDrawAdvancedController extends EditAdvancedComponentAngularJSController {
  allowedConnectedComponentTypes = ['ConceptMap', 'Draw', 'Embedded', 'Graph', 'Label', 'Table'];
}

export const EditDrawAdvancedComponent = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EditDrawAdvancedController,
  templateUrl: 'assets/wise5/components/draw/edit-draw-advanced/edit-draw-advanced.component.html'
};
