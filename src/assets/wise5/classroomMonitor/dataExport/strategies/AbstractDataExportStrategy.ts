import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { DataExportContext } from '../DataExportContext';
import { DataExportStrategy } from './DataExportStrategy';
import { removeHTMLTags } from '../../../common/string/string';
import { generateCSVFile } from '../../../common/csv/csv';

export abstract class AbstractDataExportStrategy implements DataExportStrategy {
  context: DataExportContext;
  controller: any;
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

  getColumnValue(row: any[], columnNameToNumber: any, columnName: string): any {
    return row[columnNameToNumber[columnName]];
  }

  insertColumnBeforeResponseColumn(headerRow: string[], columnName: string): void {
    headerRow.splice(headerRow.indexOf('Response'), 0, columnName);
  }

  insertColumnAtEnd(headerRow: string[], columnName: string): void {
    headerRow.push(columnName);
  }

  /**
   * Check if a component is selected
   * @param selectedNodesMap a map of node id and component id strings
   * to true
   * example
   * {
   *   "node1-38fj20egrj": true,
   *   "node1-20dbj2e0sf": true
   * }
   * @param nodeId the node id to check
   * @param componentId the component id to check
   * @return whether the component is selected
   */
  isComponentSelected(selectedNodesMap: any, nodeId: string, componentId: string): boolean {
    var result = false;
    if (selectedNodesMap != null) {
      if (
        nodeId != null &&
        componentId != null &&
        selectedNodesMap[nodeId + '-' + componentId] == true
      ) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Get the plain text representation of the student work.
   * @param componentState {object} A component state that contains the student work.
   * @returns {string} A string that can be placed in a csv cell.
   */
  getStudentDataString(componentState: any): string {
    /*
     * In Excel, if there is a cell with a long string and the cell to the
     * right of it is empty, the long string will overlap onto cells to the
     * right until the string ends or hits a cell that contains a value.
     * To prevent this from occurring, we will default empty cell values to
     * a string with a space in it. This way all values of cells are limited
     * to displaying only in its own cell.
     */
    let studentDataString = ' ';
    let componentType = componentState.componentType;
    let componentService = this.controller.componentServiceLookupService.getService(componentType);
    if (componentService != null && componentService.getStudentDataString != null) {
      studentDataString = componentService.getStudentDataString(componentState);
      studentDataString = removeHTMLTags(studentDataString);
      studentDataString = studentDataString.replace(/"/g, '""');
    } else {
      studentDataString = componentState.studentData;
    }
    return studentDataString;
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

  generateCSVFile(rows: any[], fileName: string): void {
    generateCSVFile(rows, fileName);
  }
}
