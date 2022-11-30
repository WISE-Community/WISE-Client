import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { DataExportComponent } from '../data-export/data-export.component';
import { DataExportContext } from '../DataExportContext';
import { DataExportStrategy } from './DataExportStrategy';

export abstract class AbstractDataExportStrategy implements DataExportStrategy {
  context: DataExportContext;
  controller: DataExportComponent;
  annotationService: AnnotationService;
  configService: ConfigService;
  dataExportService: DataExportService;
  projectService: TeacherProjectService;
  teacherDataService: TeacherDataService;
  utilService: UtilService;

  setDataExportContext(context: DataExportContext) {
    this.context = context;
    this.controller = context.controller;
    this.annotationService = context.controller.annotationService;
    this.configService = context.controller.configService;
    this.dataExportService = context.controller.dataExportService;
    this.projectService = context.controller.projectService;
    this.teacherDataService = context.controller.teacherDataService;
    this.utilService = context.controller.utilService;
  }

  abstract export();

  /**
   * Get a mapping of node/component id strings to true.
   * example if
   * selectedNodes = [
   *   {
   *     nodeId: "node1",
   *     componentId: "343b8aesf7"
   *   },
   *   {
   *     nodeId: "node2",
   *     componentId: "b34gaf0ug2"
   *   },
   *   {
   *     nodeId: "node3"
   *   }
   * ]
   *
   * this function will return
   * {
   *   "node1-343b8aesf7": true,
   *   "node2-b34gaf0ug2": true,
   *   "node3": true
   * }
   *
   * @param selectedNodes an array of objects that contain a nodeId field and maybe also
   * a componentId field
   * @return a mapping of node/component id strings to true
   */
  getSelectedNodesMap(selectedNodes = []) {
    const selectedNodesMap = {};
    for (var sn = 0; sn < selectedNodes.length; sn++) {
      var selectedNode = selectedNodes[sn];
      if (selectedNode != null) {
        var nodeId = selectedNode.nodeId;
        var componentId = selectedNode.componentId;
        var selectedNodeString = '';
        if (nodeId != null && componentId != null) {
          selectedNodeString = nodeId + '-' + componentId;
        } else if (nodeId != null) {
          selectedNodeString = nodeId;
        }
        if (selectedNodeString != null && selectedNodeString != '') {
          selectedNodesMap[selectedNodeString] = true;
        }
      }
    }
    return selectedNodesMap;
  }
}
