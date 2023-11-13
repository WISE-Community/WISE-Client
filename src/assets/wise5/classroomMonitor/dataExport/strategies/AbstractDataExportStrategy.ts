import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
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
  protected allOrLatest: 'all' | 'latest' = 'all';
  teacherDataService: TeacherDataService;

  setDataExportContext(context: DataExportContext) {
    this.context = context;
    this.controller = context.controller;
    this.annotationService = context.controller.annotationService;
    this.configService = context.controller.configService;
    this.dataExportService = context.controller.dataExportService;
    this.projectService = context.controller.projectService;
    this.teacherDataService = context.controller.dataService;
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

  setRunInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    const userInfo = this.configService.getUserInfoByWorkgroupId(componentState.workgroupId);
    if (userInfo != null) {
      this.setColumnValue(row, columnNameToNumber, 'Class Period', userInfo.periodName);
    }
    this.setColumnValue(row, columnNameToNumber, 'Project ID', this.configService.getProjectId());
    this.setColumnValue(row, columnNameToNumber, 'Project Name', this.configService.getRunName());
    this.setColumnValue(row, columnNameToNumber, 'Run ID', this.configService.getRunId());
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Start Date',
      millisecondsToDateTime(this.configService.getStartDate())
    );
    const endDate = this.configService.getEndDate();
    if (endDate != null) {
      this.setColumnValue(row, columnNameToNumber, 'End Date', millisecondsToDateTime(endDate));
    }
  }

  populateColumnNameMappings(columnNames: string[], columnNameToNumber: any): void {
    for (let c = 0; c < columnNames.length; c++) {
      columnNameToNumber[columnNames[c]] = c;
    }
  }

  setColumnValue(row: any[], columnNameToNumber: any, columnName: string, value: any): void {
    row[columnNameToNumber[columnName]] = value;
  }

  insertColumnBeforeResponseColumn(headerRow: string[], columnName: string): void {
    headerRow.splice(headerRow.indexOf('Response'), 0, columnName);
  }

  insertColumnAtEnd(headerRow: string[], columnName: string): void {
    headerRow.push(columnName);
  }

  generateExportFileName(
    nodeId: string,
    componentId: string,
    componentTypeWithUnderscore: string
  ): string {
    const runId = this.configService.getRunId();
    const stepNumber = this.projectService.getNodePositionById(nodeId);
    const componentNumber = this.projectService.getComponentPosition(nodeId, componentId) + 1;
    return (
      `${runId}_step_${stepNumber}_component_` +
      `${componentNumber}_${componentTypeWithUnderscore}_work.csv`
    );
  }
}
