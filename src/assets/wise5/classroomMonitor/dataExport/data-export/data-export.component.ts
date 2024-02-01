import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { DataExportContext } from '../DataExportContext';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { StudentWorkDataExportStrategy } from '../strategies/StudentWorkDataExportStrategy';
import { EventDataExportStrategy } from '../strategies/EventDataExportStrategy';
import { NotebookDataExportStrategy } from '../strategies/NotebookDataExportStrategy';
import { NotificationDataExportStrategy } from '../strategies/NotificationDataExportStrategy';
import { StudentAssetDataExportStrategy } from '../strategies/StudentAssetDataExportStrategy';
import { OneWorkgroupPerRowDataExportStrategy } from '../strategies/OneWorkgroupPerRowDataExportStrategy';
import { RawDataExportStrategy } from '../strategies/RawDataExportStrategy';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { DiscussionComponentDataExportStrategy } from '../strategies/DiscussionComponentDataExportStrategy';
import { LabelComponentDataExportStrategy } from '../strategies/LabelComponentDataExportStrategy';
import { removeHTMLTags } from '../../../common/string/string';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { ActivatedRoute, Router } from '@angular/router';
import { PeerChatComponentDataExportStrategy } from '../strategies/PeerChatComponentDataExportStrategy';
import { OpenResponseComponentDataExportStrategy } from '../strategies/OpenResponseComponentExportStrategy';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { DialogGuidanceComponentDataExportStrategy } from '../strategies/DialogGuidanceComponentDataExportStrategy';
import { MatchComponentDataExportStrategy } from '../strategies/MatchComponentDataExportStrategy';

@Component({
  selector: 'data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {
  allowedComponentTypesForAllRevisions = [
    'DialogGuidance',
    'Discussion',
    'Label',
    'Match',
    'OpenResponse',
    'PeerChat'
  ];
  allowedComponentTypesForLatestRevisions = ['DialogGuidance', 'Label', 'Match', 'OpenResponse'];
  autoScoreLabel: string = 'Auto Score';
  componentExportTooltips = {};
  componentExportDefaultColumnNames = [
    '#',
    'Workgroup ID',
    'User ID 1',
    'Student Name 1',
    'User ID 2',
    'Student Name 2',
    'User ID 3',
    'Student Name 3',
    'Class Period',
    'Project ID',
    'Project Name',
    'Run ID',
    'Start Date',
    'End Date',
    'Student Work ID',
    'Server Timestamp',
    'Client Timestamp',
    'Node ID',
    'Component ID',
    'Component Part Number',
    'Step Title',
    'Component Type',
    'Component Prompt',
    'Student Data',
    'Component Revision Counter',
    'Is Submit',
    'Submit Count'
  ];
  canViewStudentNames: boolean = false;
  componentTypeToComponentService: any = {};
  dataExportContext: DataExportContext;
  exportStepSelectionType: string = 'exportAllSteps';
  exportType: string = null; // type of export: [latestWork, allWork, events]
  exportTypeLabel: string;
  flattenedProjectAsNodeIds: string[] = [];
  ideaLabel: string = 'Idea';
  includeAnnotations: boolean;
  includeBranchPathTaken: boolean;
  includeBranchPathTakenNodeId: boolean;
  includeBranchPathTakenStepTitle: boolean;
  includeComments: boolean;
  includeCommentTimestamps: boolean;
  includeCorrectnessColumns: boolean;
  includeEvents: boolean;
  includeNames: boolean;
  includeOnlySubmits: boolean;
  includeScores: boolean;
  includeScoreTimestamps: boolean;
  includeStudentEvents: boolean;
  includeStudentNames: boolean;
  includeStudentWork: boolean;
  includeStudentWorkIds: boolean;
  includeStudentWorkTimestamps: boolean;
  includeTeacherEvents: boolean;
  itemIdLabel: string = 'Item ID';
  nodes: any[] = [];
  project: any;
  projectIdToOrder: any;
  projectItems: any;
  scoreLabel: string = 'Score';
  studentResponseLabel: string = 'Student Response';
  workSelectionType: string;

  constructor(
    public annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    private dialog: MatDialog,
    public projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.dataExportContext = new DataExportContext(this);
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.componentExportTooltips[
      'Match'
    ] = $localize`Correctness column key: 0 = Incorrect, 1 = Correct, 2 = Correct bucket but wrong position`;
    this.setDefaultExportSettings();
    this.project = this.projectService.project;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.projectItems = nodeOrderOfProject.nodes;
    this.flattenedProjectAsNodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    this.nodes = Object.values(this.projectIdToOrder);
    this.nodes.sort(this.sortNodesByOrder);
  }

  sortNodesByOrder(nodeA: any, nodeB: any): number {
    return nodeA.order - nodeB.order;
  }

  setExportType(exportType: string): void {
    this.exportType = exportType;
    this.exportTypeLabel = this.getExportTypeLabel(this.exportType);
  }

  getExportTypeLabel(exportType: string): string {
    switch (exportType) {
      case 'oneWorkgroupPerRow':
        return $localize`One Workgroup Per Row`;
      case 'latestStudentWork':
        return $localize`Latest Student Work`;
      case 'allStudentWork':
        return $localize`All Student Work`;
      case 'events':
        return $localize`Events`;
      case 'rawData':
        return $localize`Raw Data`;
      default:
        return null;
    }
  }

  /**
   * Export all or latest work for this run in CSV format
   * latestWork, allWork, and events will call this function with a null exportType.
   */
  export(exportType = this.exportType): void {
    this.dataService.saveEvent(
      'ClassroomMonitor',
      null,
      null,
      null,
      'UserInteraction',
      'exportRequested',
      { exportType: exportType }
    );
    if (exportType === 'allStudentWork' || exportType === 'latestStudentWork') {
      this.dataExportContext.setStrategy(new StudentWorkDataExportStrategy(exportType));
    } else if (exportType === 'events') {
      this.dataExportContext.setStrategy(new EventDataExportStrategy());
    } else if (exportType === 'latestNotebookItems' || exportType === 'allNotebookItems') {
      this.dataExportContext.setStrategy(new NotebookDataExportStrategy(exportType));
    } else if (exportType === 'notifications') {
      this.dataExportContext.setStrategy(new NotificationDataExportStrategy());
    } else if (exportType === 'studentAssets') {
      this.dataExportContext.setStrategy(new StudentAssetDataExportStrategy());
    } else if (exportType === 'oneWorkgroupPerRow') {
      this.dataExportContext.setStrategy(new OneWorkgroupPerRowDataExportStrategy());
    } else if (exportType === 'rawData') {
      this.dataExportContext.setStrategy(new RawDataExportStrategy());
    }
    this.dataExportContext.export();
  }

  /**
   * @param users An array of user objects. Each user object contains an id and name.
   * @returns {object} An object that contains key/value pairs. The key is userIdX
   * or studentNameX where X is an integer. The values are the corresponding actual
   * values of user id and student name.
   */
  extractUserIDsAndStudentNames(users: any[]): any {
    const extractedUserIDsAndStudentNames = {};
    for (let u = 0; u < users.length; u++) {
      let user = users[u];
      extractedUserIDsAndStudentNames['userId' + (u + 1)] = user.id;
      if (this.canViewStudentNames) {
        extractedUserIDsAndStudentNames['studentName' + (u + 1)] = user.name;
      }
    }
    return extractedUserIDsAndStudentNames;
  }

  /**
   * Create the array that will be used as a row in the student work export
   * @param columnNames all the header column name
   * @param columnNameToNumber the mapping from column name to column number
   * @param rowCounter the current row number
   * @param workgroupId the workgroup id
   * @param userId1 the User ID 1
   * @param userId2 the User ID 2
   * @param userId3 the User ID 3
   * @param periodName the period name
   * @param componentRevisionCounter the mapping of component to revision counter
   * @param componentState the component state
   * @return an array containing the cells in the row
   */
  createStudentWorkExportRow(
    columnNames: string[],
    columnNameToNumber: any,
    rowCounter: number,
    workgroupId: number,
    userId1: number,
    userId2: number,
    userId3: number,
    studentName1: string,
    studentName2: string,
    studentName3: string,
    periodName: string,
    componentRevisionCounter: any,
    componentState: any
  ): string[] {
    var row = new Array(columnNames.length);
    row.fill('');
    row[columnNameToNumber['#']] = rowCounter;
    row[columnNameToNumber['Workgroup ID']] = workgroupId;
    this.setStudentIDsAndNames(
      row,
      columnNameToNumber,
      userId1,
      studentName1,
      userId2,
      studentName2,
      userId3,
      studentName3
    );
    row[columnNameToNumber['Class Period']] = periodName;
    row[columnNameToNumber['Project ID']] = this.configService.getProjectId();
    row[columnNameToNumber['Project Name']] = this.projectService.getProjectTitle();
    row[columnNameToNumber['Run ID']] = this.configService.getRunId();
    row[columnNameToNumber['Student Work ID']] = componentState.id;
    if (componentState.serverSaveTime != null) {
      var formattedDateTime = millisecondsToDateTime(componentState.serverSaveTime);
      row[columnNameToNumber['Server Timestamp']] = formattedDateTime;
    }
    if (componentState.clientSaveTime != null) {
      const clientSaveTime = new Date(componentState.clientSaveTime);
      if (clientSaveTime != null) {
        var clientSaveTimeString =
          clientSaveTime.toDateString() + ' ' + clientSaveTime.toLocaleTimeString();
        row[columnNameToNumber['Client Timestamp']] = clientSaveTimeString;
      }
    }
    row[columnNameToNumber['Node ID']] = componentState.nodeId;
    row[columnNameToNumber['Component ID']] = componentState.componentId;
    row[columnNameToNumber['Step Title']] = this.projectService.getNodePositionAndTitle(
      componentState.nodeId
    );
    var componentPartNumber =
      this.projectService.getComponentPosition(componentState.nodeId, componentState.componentId) +
      1;
    row[columnNameToNumber['Component Part Number']] = componentPartNumber;
    var component = this.projectService.getComponent(
      componentState.nodeId,
      componentState.componentId
    );
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
      if (component.prompt != null) {
        var prompt = removeHTMLTags(component.prompt);
        prompt = prompt.replace(/"/g, '""');
        row[columnNameToNumber['Component Prompt']] = prompt;
      }
    }
    var teacherScoreAnnotation = this.annotationService.getLatestTeacherScoreAnnotationByStudentWorkId(
      componentState.id
    );
    var teacherCommentAnnotation = this.annotationService.getLatestTeacherCommentAnnotationByStudentWorkId(
      componentState.id
    );
    var autoScoreAnnotation = this.annotationService.getLatestAutoScoreAnnotationByStudentWorkId(
      componentState.id
    );
    var autoCommentAnnotation = this.annotationService.getLatestAutoCommentAnnotationByStudentWorkId(
      componentState.id
    );
    if (teacherScoreAnnotation != null) {
      if (teacherScoreAnnotation.serverSaveTime != null) {
        var teacherScoreServerSaveTime = new Date(teacherScoreAnnotation.serverSaveTime);
        if (teacherScoreServerSaveTime != null) {
          var teacherScoreServerSaveTimeString =
            teacherScoreServerSaveTime.toDateString() +
            ' ' +
            teacherScoreServerSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Teacher Score Server Timestamp']
          ] = teacherScoreServerSaveTimeString;
        }
      }
      if (teacherScoreAnnotation.clientSaveTime != null) {
        var teacherScoreClientSaveTime = new Date(teacherScoreAnnotation.clientSaveTime);
        if (teacherScoreClientSaveTime != null) {
          var teacherScoreClientSaveTimeString =
            teacherScoreClientSaveTime.toDateString() +
            ' ' +
            teacherScoreClientSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Teacher Score Client Timestamp']
          ] = teacherScoreClientSaveTimeString;
        }
      }
      var data = teacherScoreAnnotation.data;
      if (data != null) {
        var score = data.value;
        if (score != null) {
          row[columnNameToNumber['Teacher Score']] = score;
        }
        var maxScore = this.projectService.getMaxScoreForComponent(
          componentState.nodeId,
          componentState.componentId
        );
        if (maxScore != null) {
          row[columnNameToNumber['Max Teacher Score']] = maxScore;
        }
      }
    }
    if (teacherCommentAnnotation != null) {
      if (teacherCommentAnnotation.serverSaveTime != null) {
        var teacherCommentServerSaveTime = new Date(teacherCommentAnnotation.serverSaveTime);
        if (teacherCommentServerSaveTime != null) {
          var teacherCommentServerSaveTimeString =
            teacherCommentServerSaveTime.toDateString() +
            ' ' +
            teacherCommentServerSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Teacher Comment Server Timestamp']
          ] = teacherCommentServerSaveTimeString;
        }
      }
      if (teacherCommentAnnotation.clientSaveTime != null) {
        var teacherCommentClientSaveTime = new Date(teacherCommentAnnotation.clientSaveTime);
        if (teacherCommentClientSaveTime != null) {
          var teacherCommentClientSaveTimeString =
            teacherCommentClientSaveTime.toDateString() +
            ' ' +
            teacherCommentClientSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Teacher Comment Client Timestamp']
          ] = teacherCommentClientSaveTimeString;
        }
      }
      var data = teacherCommentAnnotation.data;
      if (data != null) {
        var comment = data.value;
        if (comment != null) {
          row[columnNameToNumber['Teacher Comment']] = comment;
        }
      }
    }
    if (autoScoreAnnotation != null) {
      if (autoScoreAnnotation.serverSaveTime != null) {
        var autoScoreServerSaveTime = new Date(autoScoreAnnotation.serverSaveTime);
        if (autoScoreServerSaveTime != null) {
          // get the auto score server timestamp e.g. Wed Apr 06 2016 9:05:38 AM
          var autoScoreServerSaveTimeString =
            autoScoreServerSaveTime.toDateString() +
            ' ' +
            autoScoreServerSaveTime.toLocaleTimeString();
          row[columnNameToNumber['Auto Score Server Timestamp']] = autoScoreServerSaveTimeString;
        }
      }
      if (autoScoreAnnotation.clientSaveTime != null) {
        var autoScoreClientSaveTime = new Date(autoScoreAnnotation.clientSaveTime);
        if (autoScoreClientSaveTime != null) {
          var autoScoreClientSaveTimeString =
            autoScoreClientSaveTime.toDateString() +
            ' ' +
            autoScoreClientSaveTime.toLocaleTimeString();
          row[columnNameToNumber['Auto Score Client Timestamp']] = autoScoreClientSaveTimeString;
        }
      }
      var data = autoScoreAnnotation.data;
      if (data != null) {
        var autoScore = data.value;
        if (autoScore != null) {
          row[columnNameToNumber['Auto Score']] = autoScore;
        }
        var maxAutoScore = data.maxAutoScore;
        if (maxAutoScore != null) {
          row[columnNameToNumber['Max Auto Score']] = maxAutoScore;
        }
      }
    }
    if (autoCommentAnnotation != null) {
      if (autoCommentAnnotation.serverSaveTime != null) {
        var autoCommentServerSaveTime = new Date(autoCommentAnnotation.serverSaveTime);
        if (autoCommentServerSaveTime != null) {
          var autoCommentServerSaveTimeString =
            autoCommentServerSaveTime.toDateString() +
            ' ' +
            autoCommentServerSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Auto Comment Server Timestamp']
          ] = autoCommentServerSaveTimeString;
        }
      }
      if (autoCommentAnnotation.clientSaveTime != null) {
        var autoCommentClientSaveTime = new Date(autoCommentAnnotation.clientSaveTime);
        if (autoCommentClientSaveTime != null) {
          var autoCommentClientSaveTimeString =
            autoCommentClientSaveTime.toDateString() +
            ' ' +
            autoCommentClientSaveTime.toLocaleTimeString();
          row[
            columnNameToNumber['Auto Comment Client Timestamp']
          ] = autoCommentClientSaveTimeString;
        }
      }
      var data = autoCommentAnnotation.data;
      if (data != null) {
        var autoComment = data.value;
        if (autoComment != null) {
          row[columnNameToNumber['Auto Comment']] = removeHTMLTags(autoComment);
        }
      }
    }
    var studentData = componentState.studentData;
    if (studentData != null) {
      row[columnNameToNumber['Student Data']] = studentData;
      var isCorrect = studentData.isCorrect;
      if (isCorrect != null) {
        if (isCorrect) {
          row[columnNameToNumber['Is Correct']] = 1;
        } else {
          row[columnNameToNumber['Is Correct']] = 0;
        }
      }
    }
    row[columnNameToNumber['Response']] = this.getStudentDataString(componentState);
    let revisionCounter = this.getRevisionCounter(
      componentRevisionCounter,
      componentState.nodeId,
      componentState.componentId
    );
    if (componentState.revisionCounter == null) {
      /*
       * use the revision counter obtained from the componentRevisionCounter
       * mapping. this case will happen when we are exporting all student
       * work.
       */
      row[columnNameToNumber['Component Revision Counter']] = revisionCounter;
    } else {
      /*
       * use the revision counter from the value in the component state.
       * this case will happen when we are exporting latest student work
       * because the revision counter needs to be previously calculated
       * and then set into the component state
       */
      row[columnNameToNumber['Component Revision Counter']] = componentState.revisionCounter;
    }
    this.incrementRevisionCounter(
      componentRevisionCounter,
      componentState.nodeId,
      componentState.componentId
    );
    var isSubmit = componentState.isSubmit;
    if (isSubmit) {
      row[columnNameToNumber['Is Submit']] = 1;
      if (studentData != null) {
        var submitCounter = studentData.submitCounter;
        if (submitCounter != null) {
          row[columnNameToNumber['Submit Count']] = submitCounter;
        }
      }
    } else {
      row[columnNameToNumber['Is Submit']] = 0;
    }
    return row;
  }

  setStudentIDsAndNames(
    row: any[],
    columnNameToNumber: any,
    userId1: number,
    studentName1: string,
    userId2: number,
    studentName2: string,
    userId3: number,
    studentName3: string
  ): void {
    if (userId1 != null) {
      row[columnNameToNumber['User ID 1']] = userId1;
    }
    if (studentName1 != null && this.includeStudentNames) {
      row[columnNameToNumber['Student Name 1']] = studentName1;
    }
    if (userId2 != null) {
      row[columnNameToNumber['User ID 2']] = userId2;
    }
    if (studentName2 != null && this.includeStudentNames) {
      row[columnNameToNumber['Student Name 2']] = studentName2;
    }
    if (userId3 != null) {
      row[columnNameToNumber['User ID 3']] = userId3;
    }
    if (studentName3 != null && this.includeStudentNames) {
      row[columnNameToNumber['Student Name 3']] = studentName3;
    }
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
    let componentService = this.componentServiceLookupService.getService(componentType);
    if (componentService != null && componentService.getStudentDataString != null) {
      studentDataString = componentService.getStudentDataString(componentState);
      studentDataString = removeHTMLTags(studentDataString);
      studentDataString = studentDataString.replace(/"/g, '""');
    } else {
      studentDataString = componentState.studentData;
    }
    return studentDataString;
  }

  /**
   * Get the revision number for the next component state revision.
   * @param componentRevisionCounter The mapping from component to revision
   * counter.
   * @param nodeId The node id the component is in.
   * @param componentId The component id of the component.
   */
  getRevisionCounter(componentRevisionCounter: any, nodeId: string, componentId: string): number {
    let nodeIdAndComponentId = nodeId + '_' + componentId;
    if (componentRevisionCounter[nodeIdAndComponentId] == null) {
      componentRevisionCounter[nodeIdAndComponentId] = 1;
    }
    return componentRevisionCounter[nodeIdAndComponentId];
  }

  /**
   * Increment the revision counter for the given {{nodeId}}_{{componentId}}.
   * @param componentRevisionCounter The mapping from component to revision
   * counter.
   * @param nodeId The node id the component is in.
   * @param componentId The component id of the component.
   */
  incrementRevisionCounter(
    componentRevisionCounter: any,
    nodeId: string,
    componentId: string
  ): void {
    const nodeIdAndComponentId = nodeId + '_' + componentId;
    if (componentRevisionCounter[nodeIdAndComponentId] == null) {
      componentRevisionCounter[nodeIdAndComponentId] = 1;
    }
    const revisionCounter = componentRevisionCounter[nodeIdAndComponentId];
    componentRevisionCounter[nodeIdAndComponentId] = revisionCounter + 1;
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
   * Check if a component is selected
   * @param selectedNodesMap a map of node id to true
   * example
   * {
   *   "node1": true,
   *   "node2": true
   * }
   * @param nodeId the node id to check
   * @param componentId the component id to check
   * @return whether the node is selected
   */
  isNodeSelected(selectedNodesMap: any, nodeId: string): boolean {
    var result = false;
    if (selectedNodesMap != null) {
      if (nodeId != null && selectedNodesMap[nodeId] == true) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Generate the csv file and have the client download it
   * @param rows a 2D array that represents the rows in the export
   * each row contains an array. the inner array contains strings or
   * numbers which represent the cell values in the export.
   * @param fileName the name of the file that will be generated
   */
  generateCSVFile(rows: any[], fileName: string): void {
    var csvString = '';
    if (rows != null) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        if (row != null) {
          for (var c = 0; c < row.length; c++) {
            var cell = row[c];
            if (cell == null || cell === '' || typeof cell === 'undefined') {
              cell = ' ';
            } else if (typeof cell === 'object') {
              /*
               * the cell value is an object so we will obtain the
               * string representation of the object and wrap it
               * in quotes
               */
              cell = JSON.stringify(cell);
              cell = cell.replace(/"/g, '""');
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = '"' + cell + '"';
            } else if (typeof cell === 'string') {
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = cell.replace(/"/g, '""');
              cell = '"' + cell + '"';
            }
            csvString += cell + ',';
          }
          csvString += '\r\n';
        }
      }
    }
    const csvBlob = new Blob([csvString], { type: 'text/csv; charset=utf-8' });
    FileSaver.saveAs(csvBlob, fileName);
  }

  /**
   * Get the selected nodes to export
   * @return an array of objects that contain a nodeId field and maybe also
   * a componentId field
   * example
   * [
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
   * Note: "node3" means just node3, not components in node2.
   */
  getSelectedNodesToExport(): any[] {
    const selectedNodes = [];
    for (let n = 0; n < this.projectItems.length; n++) {
      let item = this.projectItems[n];
      if (item.node.type === 'node') {
        let nodeId = item.node.id;
        if (item.checked) {
          const selectedStep = {
            nodeId: nodeId
          };
          selectedNodes.push(selectedStep);
        }
        if (item.node.components != null && item.node.components.length > 0) {
          item.node.components.map((component) => {
            if (component.checked) {
              const selectedComponent = {
                nodeId: nodeId,
                componentId: component.id
              };
              selectedNodes.push(selectedComponent);
            }
          });
        }
      }
    }
    return selectedNodes;
  }

  /**
   * Handle node item clicked
   * @param nodeItem the item object for a given activity or step
   */
  nodeItemClicked(nodeItem: any): void {
    if (nodeItem.node != null) {
      var node = nodeItem.node;
      if (node.ids != null) {
        for (var n = 0; n < node.ids.length; n++) {
          var nodeId = node.ids[n];
          var childNodeItem = this.projectIdToOrder[nodeId];
          childNodeItem.checked = nodeItem.checked;
          var components = childNodeItem.node.components;
          if (components != null) {
            for (var c = 0; c < components.length; c++) {
              components[c].checked = nodeItem.checked;
            }
          }
        }
      } else if (node.components != null) {
        if (nodeItem.checked) {
          if (
            nodeItem.node != null &&
            nodeItem.node.components != null &&
            nodeItem.node.components.length > 0
          ) {
            nodeItem.node.components.map((componentItem) => {
              componentItem.checked = true;
            });
          }
        } else {
          if (
            nodeItem.node != null &&
            nodeItem.node.components != null &&
            nodeItem.node.components.length > 0
          ) {
            nodeItem.node.components.map((componentItem) => {
              componentItem.checked = false;
            });
          }
        }
      }
    }
  }

  selectAll(doSelect: boolean = true): void {
    if (this.projectIdToOrder != null) {
      for (let nodeId in this.projectIdToOrder) {
        let projectItem = this.projectIdToOrder[nodeId];
        if (projectItem.order != 0) {
          projectItem.checked = doSelect;
          if (projectItem.node.type != 'group') {
            if (
              projectItem.node != null &&
              projectItem.node.components != null &&
              projectItem.node.components.length > 0
            ) {
              projectItem.node.components.map((componentItem) => {
                componentItem.checked = doSelect;
              });
            }
          }
        }
      }
    }
  }

  deselectAll(): void {
    this.selectAll(false);
  }

  previewProject(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
  }

  previewNode(node: any): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}/${node.id}`);
  }

  /**
   * Get the component service for a component type
   * @param componentType the component type
   * @return the component service or null if it doesn't exist
   */
  getComponentService(componentType: any): any {
    let componentService = null;
    if (componentType != null) {
      componentService = this.componentServiceLookupService.getService(componentType);
    }
    return componentService;
  }

  /**
   * Check if we want to export this node
   * @param selectedNodesMap a mapping of node id to boolean value of whether
   * the researcher has checked the node
   * @param nodeId the node id
   * @return whether the node was checked
   */
  exportNode(selectedNodesMap: any, nodeId: string): boolean {
    if (selectedNodesMap == null || this.isNodeSelected(selectedNodesMap, nodeId)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the node position
   * @param nodeId the node id
   * @returns the node position
   */
  getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  /**
   * Get the node title for a node
   * @param nodeId the node id
   * @returns the node title
   */
  getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  /**
   * Check if a node id is for a group
   * @param nodeId
   * @returns whether the node is a group node
   */
  isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  /**
   * Check if the node is in any branch path
   * @param nodeId the node id of the node
   * @return whether the node is in any branch path
   */
  isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }

  defaultClicked(): void {
    this.setDefaultExportSettings();
  }

  everythingClicked(): void {
    this.includeStudentWork = true;
    this.includeStudentWorkIds = true;
    this.includeStudentNames = true;
    this.includeStudentWorkTimestamps = true;
    this.includeBranchPathTaken = true;
    this.includeBranchPathTakenStepTitle = true;
    this.includeBranchPathTakenNodeId = true;
    this.includeScores = true;
    this.includeScoreTimestamps = true;
    this.includeComments = true;
    this.includeCommentTimestamps = true;
    this.exportStepSelectionType = 'exportAllSteps';
    this.includeAnnotations = true;
    this.includeEvents = true;
  }

  setDefaultExportSettings(): void {
    this.includeStudentWork = true;
    this.includeStudentWorkIds = false;
    if (this.canViewStudentNames) {
      this.includeStudentNames = true;
    } else {
      this.includeStudentNames = false;
    }
    this.includeStudentWorkTimestamps = false;
    this.includeBranchPathTaken = true;
    this.includeBranchPathTakenStepTitle = false;
    this.includeBranchPathTakenNodeId = false;
    this.includeScores = false;
    this.includeScoreTimestamps = false;
    this.includeComments = false;
    this.includeCommentTimestamps = false;
    this.includeStudentEvents = true;
    this.includeTeacherEvents = true;
    this.includeNames = false;
    this.exportStepSelectionType = 'exportAllSteps';
    this.includeAnnotations = false;
    this.includeEvents = false;

    /*
     * remove checked fields that may have been accidentally saved by the
     * authoring tool or grading tool
     */
    this.projectService.cleanupBeforeSave();
  }

  canExportAllRevisionsForComponent(component: any): boolean {
    return this.canExportForComponent(component, this.allowedComponentTypesForAllRevisions);
  }

  canExportLatestRevisionsForComponent(component: any): boolean {
    return this.canExportForComponent(component, this.allowedComponentTypesForLatestRevisions);
  }

  canExportForComponent(component: any, allowedComponentTypes: string[]): boolean {
    for (const allowedComponentType of allowedComponentTypes) {
      if (component.type === allowedComponentType) {
        return true;
      }
    }
    return false;
  }

  /**
   * Show the page where users can export work for a specific component.
   */
  showExportComponentDataPage(): void {
    this.workSelectionType = 'exportAllWork';
    this.includeCorrectnessColumns = true;
    this.includeOnlySubmits = false;
    this.exportType = 'componentData';
  }

  /**
   * Export all the work for each student for  a specific component.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  exportComponentAllRevisions(nodeId: string, component: any): void {
    this.setAllWorkSelectionType();
    if (component.type === 'Match') {
      this.dataExportContext.setStrategy(
        new MatchComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'all'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'Discussion') {
      this.dataExportContext.setStrategy(
        new DiscussionComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams()
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'DialogGuidance') {
      this.dataExportContext.setStrategy(
        new DialogGuidanceComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'all'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'OpenResponse') {
      this.dataExportContext.setStrategy(
        new OpenResponseComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'all'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'Label') {
      this.dataExportContext.setStrategy(
        new LabelComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'all'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'PeerChat') {
      this.dataExportContext.setStrategy(
        new PeerChatComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams()
        )
      );
      this.dataExportContext.export();
    }
  }

  /**
   * Export the latest work for each student for a given component.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  exportComponentLatestRevisions(nodeId: string, component: any): void {
    this.setLatestWorkSelectionType();
    if (component.type === 'Match') {
      this.dataExportContext.setStrategy(
        new MatchComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'latest'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'DialogGuidance') {
      this.dataExportContext.setStrategy(
        new DialogGuidanceComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'latest'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'OpenResponse') {
      this.dataExportContext.setStrategy(
        new OpenResponseComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'latest'
        )
      );
      this.dataExportContext.export();
    } else if (component.type === 'Label') {
      this.dataExportContext.setStrategy(
        new LabelComponentDataExportStrategy(
          nodeId,
          component,
          this.getComponentDataExportParams(),
          'latest'
        )
      );
      this.dataExportContext.export();
    }
  }

  private getComponentDataExportParams(): ComponentDataExportParams {
    return {
      canViewStudentNames: this.canViewStudentNames,
      includeOnlySubmits: this.includeOnlySubmits,
      includeStudentNames: this.includeStudentNames,
      workSelectionType: this.workSelectionType
    };
  }

  setAllWorkSelectionType(): void {
    this.setWorkSelectionType('exportAllWork');
  }

  setLatestWorkSelectionType(): void {
    this.setWorkSelectionType('exportLatestWork');
  }

  setWorkSelectionType(workSelectionType: string): void {
    this.workSelectionType = workSelectionType;
  }

  showDownloadingExportMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Downloading Export`
      },
      disableClose: false
    });
  }

  hideDownloadingExportMessage(): void {
    this.dialog.closeAll();
  }

  protected exportVisitsClicked(): void {
    this.router.navigate(['visits'], { relativeTo: this.route });
  }
}
