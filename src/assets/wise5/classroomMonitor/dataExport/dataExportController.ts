'use strict';

import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { DataExportService } from '../../services/dataExportService';
import { MatchService } from '../../components/match/matchService';
import { TeacherDataService } from '../../services/teacherDataService';
import { UtilService } from '../../services/utilService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DataExportContext } from './DataExportContext';
import { RawDataExportStrategy } from './strategies/RawDataExportStrategy';
import { OneWorkgroupPerRowDataExportStrategy } from './strategies/OneWorkgroupPerRowDataExportStrategy';
import { EventDataExportStrategy } from './strategies/EventDataExportStrategy';
import { StudentAssetDataExportStrategy } from './strategies/StudentAssetDataExportStrategy';
import { NotebookDataExportStrategy } from './strategies/NotebookDataExportStrategy';

class DataExportController {
  allowedComponentTypesForAllRevisions = ['DialogGuidance', 'Discussion', 'Match', 'OpenResponse'];
  allowedComponentTypesForLatestRevisions = ['DialogGuidance', 'Match', 'OpenResponse'];
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
  dataExportContext: DataExportContext = new DataExportContext();
  dialogGuidanceComputerResponseLabel: string = 'Computer Response';
  dialogGuidanceRevisionLabel: string = 'Revision';
  embeddedTableKeyToValue = {
    co2saved: 'CO2 Saved',
    current: 'Current',
    future: 'Future',
    kwhsaved: 'kWh Saved',
    minutes: 'Minutes'
  };
  exportStepSelectionType: string = 'exportAllSteps';
  exportType: string = null; // type of export: [latestWork, allWork, events]
  ideaLabel: string = 'Idea';
  includeAnnotations: boolean;
  includeBranchPathTaken: boolean;
  includeBranchPathTakenNodeId: boolean;
  includeBranchPathTakenStepTitle: boolean;
  includeComments: boolean;
  includeCommentTimestamps: boolean;
  includeCorrectnessColumns: boolean;
  includeEvents: boolean;
  includeOnlySubmits: boolean;
  includeNames: boolean;
  includeScores: boolean;
  includeScoreTimestamps: boolean;
  includeStudentNames: boolean;
  includeStudentEvents: boolean;
  includeTeacherEvents: boolean;
  includeStudentWork: boolean;
  includeStudentWorkIds: boolean;
  includeStudentWorkTimestamps: boolean;
  itemIdLabel: string = 'Item ID';
  project: any;
  projectIdToOrder: any;
  projectItems: any;
  scoreLabel: string = 'Score';
  studentResponseLabel: string = 'Student Response';
  workSelectionType: string;

  static $inject = [
    '$injector',
    '$mdDialog',
    '$state',
    'AnnotationService',
    'ConfigService',
    'DataExportService',
    'FileSaver',
    'MatchService',
    'ProjectService',
    'TeacherDataService',
    'UtilService'
  ];

  constructor(
    private $injector: any,
    private $mdDialog: any,
    private $state: any,
    public AnnotationService: AnnotationService,
    public ConfigService: ConfigService,
    public DataExportService: DataExportService,
    public FileSaver: any,
    public MatchService: MatchService,
    public ProjectService: TeacherProjectService,
    public TeacherDataService: TeacherDataService,
    public UtilService: UtilService
  ) {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
    this.componentExportTooltips[
      'Match'
    ] = $localize`Correctness column key: 0 = Incorrect, 1 = Correct, 2 = Correct bucket but wrong position`;
    this.setDefaultExportSettings();
    this.project = this.ProjectService.project;
    let nodeOrderOfProject = this.ProjectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.projectItems = nodeOrderOfProject.nodes;
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'dataExportViewDisplayed',
      data = {};
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  /**
   * Export all or latest work for this run in CSV format
   * latestWork, allWork, and events will call this function with a null exportType.
   */
  export(exportType = this.exportType) {
    this.TeacherDataService.saveEvent(
      'ClassroomMonitor',
      null,
      null,
      null,
      'UserInteraction',
      'exportRequested',
      { exportType: exportType }
    );
    if (exportType === 'allStudentWork') {
      this.exportAllStudentWork();
    } else if (exportType === 'latestStudentWork') {
      this.exportLatestStudentWork();
    } else if (exportType === 'events') {
      this.dataExportContext.setStrategy(new EventDataExportStrategy(this));
      this.dataExportContext.export();
    } else if (exportType === 'latestNotebookItems' || exportType === 'allNotebookItems') {
      this.dataExportContext.setStrategy(new NotebookDataExportStrategy(this, exportType));
      this.dataExportContext.export();
    } else if (exportType === 'notifications') {
      this.exportNotifications();
    } else if (exportType === 'studentAssets') {
      this.dataExportContext.setStrategy(new StudentAssetDataExportStrategy(this));
      this.dataExportContext.export();
    } else if (exportType === 'oneWorkgroupPerRow') {
      this.dataExportContext.export();
    } else if (exportType === 'rawData') {
      this.dataExportContext.export();
    }
  }

  exportAllStudentWork() {
    this.exportStudentWork('allStudentWork');
  }

  exportLatestStudentWork() {
    this.exportStudentWork('latestStudentWork');
  }

  /**
   * Export all the student work
   * @param exportType the export type e.g. "allStudentWork" or "latestStudentWork"
   */
  exportStudentWork(exportType) {
    this.showDownloadingExportMessage();
    var selectedNodes = [];
    var selectedNodesMap = null;
    if (this.exportStepSelectionType === 'exportSelectSteps') {
      selectedNodes = this.getSelectedNodesToExport();
      if (selectedNodes == null || selectedNodes.length == 0) {
        alert('Please select a step to export.');
        return;
      } else {
        selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
      }
    }
    this.DataExportService.retrieveStudentDataExport(selectedNodes).then((result) => {
      var runId = this.ConfigService.getRunId();
      var rows = [];
      var rowCounter = 1;
      var columnNameToNumber = {};
      var columnNames = [
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
        'Teacher Score Server Timestamp',
        'Teacher Score Client Timestamp',
        'Teacher Score',
        'Max Teacher Score',
        'Teacher Comment Server Timestamp',
        'Teacher Comment Client Timestamp',
        'Teacher Comment',
        'Auto Score Server Timestamp',
        'Auto Score Client Timestamp',
        'Auto Score',
        'Max Auto Score',
        'Auto Comment Server Timestamp',
        'Auto Comment Client Timestamp',
        'Auto Comment',
        'Step Title',
        'Component Type',
        'Component Prompt',
        'Student Data',
        'Component Revision Counter',
        'Is Correct',
        'Is Submit',
        'Submit Count',
        'Response'
      ];
      var headerRow = [];
      for (var c = 0; c < columnNames.length; c++) {
        var columnName = columnNames[c];
        if (columnName != null) {
          columnNameToNumber[columnName] = c;
        }
        headerRow.push(columnName);
      }
      rows.push(headerRow);
      for (const workgroupId of this.ConfigService.getClassmateWorkgroupIds()) {
        var userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);
        var extractedUserIDsAndStudentNames = this.extractUserIDsAndStudentNames(userInfo.users);
        /*
         * a mapping from component to component revision counter.
         * the key will be {{nodeId}}_{{componentId}} and the
         * value will be a number.
         */
        var componentRevisionCounter = {};
        let componentStates = [];
        if (exportType === 'allStudentWork') {
          componentStates = this.TeacherDataService.getComponentStatesByWorkgroupId(workgroupId);
        } else if (exportType === 'latestStudentWork') {
          this.TeacherDataService.injectRevisionCounterIntoComponentStates(
            this.TeacherDataService.getComponentStatesByWorkgroupId(workgroupId)
          );
          componentStates = this.TeacherDataService.getLatestComponentStatesByWorkgroupId(
            workgroupId
          );
        }
        if (componentStates != null) {
          for (var c = 0; c < componentStates.length; c++) {
            var componentState = componentStates[c];
            if (componentState != null) {
              var exportRow = true;
              if (this.exportStepSelectionType === 'exportSelectSteps') {
                if (
                  !this.isComponentSelected(
                    selectedNodesMap,
                    componentState.nodeId,
                    componentState.componentId
                  )
                ) {
                  exportRow = false;
                }
              }
              if (exportRow) {
                var row = this.createStudentWorkExportRow(
                  columnNames,
                  columnNameToNumber,
                  rowCounter,
                  workgroupId,
                  extractedUserIDsAndStudentNames['userId1'],
                  extractedUserIDsAndStudentNames['userId2'],
                  extractedUserIDsAndStudentNames['userId3'],
                  extractedUserIDsAndStudentNames['studentName1'],
                  extractedUserIDsAndStudentNames['studentName2'],
                  extractedUserIDsAndStudentNames['studentName3'],
                  userInfo.periodName,
                  componentRevisionCounter,
                  componentState
                );
                rows.push(row);
                rowCounter++;
              }
            }
          }
        }
      }
      var fileName = '';
      if (exportType === 'allStudentWork') {
        fileName = runId + '_all_work.csv';
      } else if (exportType === 'latestStudentWork') {
        fileName = runId + '_latest_work.csv';
      }
      this.generateCSVFile(rows, fileName);
      this.hideDownloadingExportMessage();
    });
  }

  /**
   * @param users An array of user objects. Each user object contains an id and name.
   * @returns {object} An object that contains key/value pairs. The key is userIdX
   * or studentNameX where X is an integer. The values are the corresponding actual
   * values of user id and student name.
   */
  extractUserIDsAndStudentNames(users) {
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
    columnNames,
    columnNameToNumber,
    rowCounter,
    workgroupId,
    userId1,
    userId2,
    userId3,
    studentName1,
    studentName2,
    studentName3,
    periodName,
    componentRevisionCounter,
    componentState
  ) {
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
    row[columnNameToNumber['Project ID']] = this.ConfigService.getProjectId();
    row[columnNameToNumber['Project Name']] = this.ProjectService.getProjectTitle();
    row[columnNameToNumber['Run ID']] = this.ConfigService.getRunId();
    row[columnNameToNumber['Student Work ID']] = componentState.id;
    if (componentState.serverSaveTime != null) {
      var formattedDateTime = this.UtilService.convertMillisecondsToFormattedDateTime(
        componentState.serverSaveTime
      );
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
    row[columnNameToNumber['Step Title']] = this.ProjectService.getNodePositionAndTitleByNodeId(
      componentState.nodeId
    );
    var componentPartNumber =
      this.ProjectService.getComponentPositionByNodeIdAndComponentId(
        componentState.nodeId,
        componentState.componentId
      ) + 1;
    row[columnNameToNumber['Component Part Number']] = componentPartNumber;
    var component = this.ProjectService.getComponentByNodeIdAndComponentId(
      componentState.nodeId,
      componentState.componentId
    );
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
      if (component.prompt != null) {
        var prompt = this.UtilService.removeHTMLTags(component.prompt);
        prompt = prompt.replace(/"/g, '""');
        row[columnNameToNumber['Component Prompt']] = prompt;
      }
    }
    var teacherScoreAnnotation = this.AnnotationService.getLatestTeacherScoreAnnotationByStudentWorkId(
      componentState.id
    );
    var teacherCommentAnnotation = this.AnnotationService.getLatestTeacherCommentAnnotationByStudentWorkId(
      componentState.id
    );
    var autoScoreAnnotation = this.AnnotationService.getLatestAutoScoreAnnotationByStudentWorkId(
      componentState.id
    );
    var autoCommentAnnotation = this.AnnotationService.getLatestAutoCommentAnnotationByStudentWorkId(
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
        var maxScore = this.ProjectService.getMaxScoreForComponent(
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
          row[columnNameToNumber['Auto Comment']] = this.UtilService.removeHTMLTags(autoComment);
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
  ) {
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
  getStudentDataString(componentState) {
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
    let componentService = this.getComponentService(componentType);
    if (componentService != null && componentService.getStudentDataString != null) {
      studentDataString = componentService.getStudentDataString(componentState);
      studentDataString = this.UtilService.removeHTMLTags(studentDataString);
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
  getRevisionCounter(componentRevisionCounter, nodeId, componentId) {
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
  incrementRevisionCounter(componentRevisionCounter, nodeId, componentId) {
    let nodeIdAndComponentId = nodeId + '_' + componentId;
    if (componentRevisionCounter[nodeIdAndComponentId] == null) {
      componentRevisionCounter[nodeIdAndComponentId] = 1;
    }
    let revisionCounter = componentRevisionCounter[nodeIdAndComponentId];
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
  isComponentSelected(selectedNodesMap, nodeId, componentId) {
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
  isNodeSelected(selectedNodesMap, nodeId) {
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
  generateCSVFile(rows, fileName) {
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
    this.FileSaver.saveAs(csvBlob, fileName);
  }

  escapeContent(str) {
    return str.replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
  }

  exportNotifications() {
    this.showDownloadingExportMessage();
    this.DataExportService.retrieveNotificationsExport().then((result) => {
      const notifications = result;
      const columnNames = [
        'ID',
        'Teacher Username',
        'Run ID',
        'Period ID',
        'Period Name',
        'Project ID',
        'Node ID',
        'Component ID',
        'Step Number',
        'Step Title',
        'Component Part Number',
        'Component Type',
        'Server Save Time',
        'Time Generated',
        'Time Dismissed',
        'From Workgroup ID',
        'To Workgroup ID',
        'User ID 1',
        'User ID 2',
        'User ID 3',
        'Data',
        'Group ID',
        'Type',
        'Message'
      ];
      const columnNameToNumber = {};
      const headerRow = [];
      for (let c = 0; c < columnNames.length; c++) {
        const columnName = columnNames[c];
        columnNameToNumber[columnName] = c;
        headerRow.push(columnName);
      }
      const rows = [];
      rows.push(headerRow);
      for (const notification of notifications) {
        rows.push(this.createExportNotificationRow(columnNames, columnNameToNumber, notification));
      }
      const runId = this.ConfigService.getRunId();
      const fileName = `${runId}_notifications.csv`;
      this.generateCSVFile(rows, fileName);
      this.hideDownloadingExportMessage();
    });
  }

  createExportNotificationRow(columnNames, columnNameToNumber, notification) {
    const row = new Array(columnNames.length);
    row.fill(' ');
    row[columnNameToNumber['ID']] = notification.id;
    row[columnNameToNumber['Node ID']] = notification.nodeId;
    row[columnNameToNumber['Component ID']] = notification.componentId;
    const component = this.ProjectService.getComponentByNodeIdAndComponentId(
      notification.nodeId,
      notification.componentId
    );
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
    }
    row[columnNameToNumber['Step Number']] = this.getNodePositionById(notification.nodeId);
    row[columnNameToNumber['Step Title']] = this.getNodeTitleByNodeId(notification.nodeId);
    const componentPosition = this.ProjectService.getComponentPositionByNodeIdAndComponentId(
      notification.nodeId,
      notification.componentId
    );
    if (componentPosition != -1) {
      row[columnNameToNumber['Component Part Number']] = componentPosition + 1;
    }
    row[
      columnNameToNumber['Server Save Time']
    ] = this.UtilService.convertMillisecondsToFormattedDateTime(notification.serverSaveTime);
    row[
      columnNameToNumber['Time Generated']
    ] = this.UtilService.convertMillisecondsToFormattedDateTime(notification.timeGenerated);
    if (notification.timeDismissed != null) {
      row[
        columnNameToNumber['Time Dismissed']
      ] = this.UtilService.convertMillisecondsToFormattedDateTime(notification.timeDismissed);
    }
    row[columnNameToNumber['Type']] = notification.type;
    if (notification.groupId != null) {
      row[columnNameToNumber['Group ID']] = notification.groupId;
    }
    row[columnNameToNumber['Message']] = notification.message;
    row[columnNameToNumber['Data']] = notification.data;
    row[columnNameToNumber['Period ID']] = notification.periodId;
    row[columnNameToNumber['Run ID']] = notification.runId;
    row[columnNameToNumber['From Workgroup ID']] = notification.fromWorkgroupId;
    row[columnNameToNumber['To Workgroup ID']] = notification.toWorkgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(notification.toWorkgroupId);
    row[columnNameToNumber['Period Name']] = userInfo.periodName;
    row[columnNameToNumber['Teacher Username']] = this.ConfigService.getTeacherUserInfo().username;
    row[columnNameToNumber['Project ID']] = this.ConfigService.getProjectId();
    if (userInfo.users != null) {
      this.addStudentUserIDsToNotificationRow(row, columnNameToNumber, userInfo);
    }
    return row;
  }

  addStudentUserIDsToNotificationRow(row: any, columnNameToNumber: any, userInfo: any) {
    for (let i = 0; i <= 2; i++) {
      const student = userInfo.users[i];
      if (student != null) {
        row[columnNameToNumber[`User ID ${i + 1}`]] = student.id;
      }
    }
    return row;
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
  getSelectedNodesToExport() {
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

  /**
   * Handle node item clicked
   * @param nodeItem the item object for a given activity or step
   */
  nodeItemClicked(nodeItem) {
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

  selectAll(doSelect = true) {
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

  deselectAll() {
    this.selectAll(false);
  }

  previewProject() {
    window.open(`${this.ConfigService.getConfigParam('previewProjectURL')}`);
  }

  previewNode(node) {
    window.open(`${this.ConfigService.getConfigParam('previewProjectURL')}/${node.id}`);
  }

  /**
   * Create mappings from column id to column index so that we can easily
   * insert cell values into the correct column when we fill in the row
   * for a workgroup
   * @param columnIds an array of column ids in the order that the
   * associated columns will appear in the export
   * @param descriptionRowHeaders an array of headers in the description row
   * @return an object that contains mappings from column id to column index
   */
  getColumnIdToColumnIndex(columnIds, descriptionRowHeaders) {
    /*
     * the student work columns will start after the description header
     * columns and vertical headers column
     */
    var numberOfColumnsToShift = descriptionRowHeaders.length + 1;
    var columnIdToColumnIndex = {};

    /*
     * loop through all the description columns
     * Workgroup ID
     * User ID 1
     * User ID 2
     * User ID 3
     * Class Period
     * Project ID
     * Project Name
     * Run ID
     * Start Date
     * End Date
     */
    for (var d = 0; d < descriptionRowHeaders.length; d++) {
      var descriptionRowHeader = descriptionRowHeaders[d];
      columnIdToColumnIndex[descriptionRowHeader] = d;
    }

    // generate the header row by looping through all the column names
    for (var c = 0; c < columnIds.length; c++) {
      var columnId = columnIds[c];
      if (columnId != null) {
        /*
         * Add a mapping from column name to column index. The columns
         * for the components will start after the blank columns and
         * after the column that contains the vertical headers for the
         * top rows. We need to add +1 for the vertical headers column
         * which contains the values Step Title, Component Part Number,
         * Component Type, Prompt, Node ID, Component ID, Description.
         */
        columnIdToColumnIndex[columnId] = numberOfColumnsToShift + c;
      }
    }
    return columnIdToColumnIndex;
  }

  /**
   * Get the component service for a component type
   * @param componentType the component type
   * @return the component service or null if it doesn't exist
   */
  getComponentService(componentType) {
    let componentService = null;
    if (componentType != null) {
      componentService = this.componentTypeToComponentService[componentType];
      if (componentService == null) {
        componentService = this.$injector.get(componentType + 'Service');
        this.componentTypeToComponentService[componentType] = componentService;
      }
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
  exportNode(selectedNodesMap, nodeId) {
    if (selectedNodesMap == null || this.isNodeSelected(selectedNodesMap, nodeId)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if we want to export this component
   * @param selectedNodesMap a mapping of node id to boolean value of whether
   * the researcher has checked the node
   * @param nodeId the node id
   * @param componentId the component id
   * @return whether the component was checked
   */
  exportComponent(selectedNodesMap, nodeId, componentId) {
    if (
      selectedNodesMap == null ||
      this.isComponentSelected(selectedNodesMap, nodeId, componentId)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * The "Export One Workgroup Per Row" button was clicked so we will display the
   * view for it
   */
  exportOneWorkgroupPerRowClicked() {
    this.exportType = 'oneWorkgroupPerRow';
    this.dataExportContext.setStrategy(new OneWorkgroupPerRowDataExportStrategy(this));
  }

  /**
   * Get the node position
   * @param nodeId the node id
   * @returns the node position
   */
  getNodePositionById(nodeId) {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  /**
   * Get the node title for a node
   * @param nodeId the node id
   * @returns the node title
   */
  getNodeTitleByNodeId(nodeId) {
    return this.ProjectService.getNodeTitleByNodeId(nodeId);
  }

  /**
   * Check if a node id is for a group
   * @param nodeId
   * @returns whether the node is a group node
   */
  isGroupNode(nodeId) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  /**
   * Check if the node is in any branch path
   * @param nodeId the node id of the node
   * @return whether the node is in any branch path
   */
  isNodeInAnyBranchPath(nodeId) {
    return this.ProjectService.isNodeInAnyBranchPath(nodeId);
  }

  defaultClicked() {
    this.setDefaultExportSettings();
  }

  everythingClicked() {
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

  setDefaultExportSettings() {
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
    this.ProjectService.cleanupBeforeSave();
  }

  rawDataExportClicked() {
    this.exportType = 'rawData';
    this.dataExportContext.setStrategy(new RawDataExportStrategy(this));
  }

  removeNamesFromWorkgroup(workgroup) {
    delete workgroup.username;
    delete workgroup.displayNames;
    for (let user of workgroup.users) {
      delete user.name;
      delete user.firstName;
      delete user.lastName;
    }
  }

  /**
   * Get the composite id for a given object
   * @param object a component state, annotation, or event
   * @return the composite id for the object
   * example
   * 'node3'
   * 'node4-wt38sdf1d3'
   */
  getCompositeId(object) {
    var compositeId = null;
    if (object.nodeId != null) {
      compositeId = object.nodeId;
    }
    if (object.componentId != null) {
      compositeId += '-' + object.componentId;
    }
    return compositeId;
  }

  canExportAllRevisionsForComponent(component: any) {
    return this.canExportForComponent(component, this.allowedComponentTypesForAllRevisions);
  }

  canExportLatestRevisionsForComponent(component: any) {
    return this.canExportForComponent(component, this.allowedComponentTypesForLatestRevisions);
  }

  canExportForComponent(component: any, allowedComponentTypes: string[]): boolean {
    for (const allowedComponentType of allowedComponentTypes) {
      if (component.type === allowedComponentType) {
        return true;
      }
    }
    return this.isEmbeddedTableComponentAndCanExport(component);
  }

  isEmbeddedTableComponentAndCanExport(component: any): boolean {
    return (
      component.type === 'Embedded' &&
      (this.isDevicesEmbeddedTable(component) || this.isTransporationEmbeddedTable(component))
    );
  }

  isDevicesEmbeddedTable(component: any): boolean {
    return component.tags != null && component.tags.includes('devices-kwh-co2-table');
  }

  isTransporationEmbeddedTable(component: any): boolean {
    return component.tags != null && component.tags.includes('transportation-co2-table');
  }

  /**
   * Show the page where users can export work for a specific component.
   */
  showExportComponentDataPage() {
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
  exportComponentAllRevisions(nodeId: string, component: any) {
    this.setAllWorkSelectionType();
    if (component.type === 'Match') {
      this.exportMatchComponent(nodeId, component);
    } else if (component.type === 'Discussion') {
      this.exportDiscussionComponent(nodeId, component);
    } else if (component.type === 'DialogGuidance') {
      this.exportDialogGuidanceComponent(nodeId, component);
    } else if (component.type === 'OpenResponse') {
      this.exportOpenResponseComponent(nodeId, component);
    } else if (this.isEmbeddedTableComponentAndCanExport(component)) {
      this.exportEmbeddedComponent(nodeId, component);
    }
  }

  /**
   * Export the latest work for each student for a given component.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  exportComponentLatestRevisions(nodeId: string, component: any) {
    this.setLatestWorkSelectionType();
    if (component.type === 'Match') {
      this.exportMatchComponent(nodeId, component);
    } else if (component.type === 'DialogGuidance') {
      this.exportDialogGuidanceComponent(nodeId, component);
    } else if (component.type === 'OpenResponse') {
      this.exportOpenResponseComponent(nodeId, component);
    } else if (this.isEmbeddedTableComponentAndCanExport(component)) {
      this.exportEmbeddedComponent(nodeId, component);
    }
  }

  /**
   * Generate an export for a specific Discussion component.
   * TODO: Move these Discussion export functions to the DiscussionService.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  exportDiscussionComponent(nodeId, component) {
    this.showDownloadingExportMessage();
    const components = this.getComponentsParam(nodeId, component.id);
    this.DataExportService.retrieveStudentDataExport(components).then((result) => {
      const columnNames = [];
      const columnNameToNumber = {};
      let rows = [
        this.generateDiscussionComponentHeaderRow(component, columnNames, columnNameToNumber)
      ];
      rows = rows.concat(
        this.generateDiscussionComponentWorkRows(component, columnNames, columnNameToNumber, nodeId)
      );
      const fileName = this.generateDiscussionExportFileName(nodeId, component.id);
      this.generateCSVFile(rows, fileName);
      this.hideDownloadingExportMessage();
    });
  }

  generateDiscussionComponentHeaderRow(component, columnNames, columnNameToNumber) {
    this.populateDiscussionColumnNames(component, columnNames, columnNameToNumber);
    const headerRow = [];
    for (let columnName of columnNames) {
      headerRow.push(columnName);
    }
    return headerRow;
  }

  populateDiscussionColumnNames(component, columnNames, columnNameToNumber) {
    const defaultDiscussionColumnNames = [
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
      'Server Timestamp',
      'Client Timestamp',
      'Node ID',
      'Component ID',
      'Component Part Number',
      'Step Title',
      'Component Type',
      'Component Prompt',
      'Student Data',
      'Thread ID',
      'Student Work ID',
      'Post Level',
      'Post Text'
    ];
    for (let c = 0; c < defaultDiscussionColumnNames.length; c++) {
      const defaultDiscussionColumnName = defaultDiscussionColumnNames[c];
      columnNameToNumber[defaultDiscussionColumnName] = c;
      columnNames.push(defaultDiscussionColumnName);
    }
  }

  generateDiscussionComponentWorkRows(component, columnNames, columnNameToNumber, nodeId) {
    const rows = [];
    const componentStates = this.TeacherDataService.getComponentStatesByComponentId(component.id);
    const structuredPosts = this.getStructuredPosts(componentStates);
    let rowCounter = 1;
    for (let threadId of Object.keys(structuredPosts)) {
      let topLevelPost = structuredPosts[threadId];
      rows.push(
        this.generateDiscussionComponentWorkRow(
          component,
          topLevelPost.workgroupId,
          columnNames,
          columnNameToNumber,
          nodeId,
          component.id,
          rowCounter,
          topLevelPost,
          threadId
        )
      );
      rowCounter++;
      if (topLevelPost.replies != null) {
        for (let replyPost of topLevelPost.replies) {
          rows.push(
            this.generateDiscussionComponentWorkRow(
              component,
              replyPost.workgroupId,
              columnNames,
              columnNameToNumber,
              nodeId,
              component.id,
              rowCounter,
              replyPost,
              threadId
            )
          );
          rowCounter++;
        }
      }
    }
    return rows;
  }

  generateDiscussionComponentWorkRow(
    component,
    workgroupId,
    columnNames,
    columnNameToNumber,
    nodeId,
    componentId,
    rowCounter,
    componentState,
    threadId
  ) {
    const row = new Array(columnNames.length);
    row.fill('');
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);
    if (userInfo != null) {
      let userId1 = null;
      let userId2 = null;
      let userId3 = null;
      let studentName1 = null;
      let studentName2 = null;
      let studentName3 = null;
      if (userInfo.users[0] != null) {
        userId1 = userInfo.users[0].id;
        studentName1 = userInfo.users[0].name;
      }
      if (userInfo.users[1] != null) {
        userId2 = userInfo.users[1].id;
        studentName2 = userInfo.users[1].name;
      }
      if (userInfo.users[2] != null) {
        userId3 = userInfo.users[2].id;
        studentName3 = userInfo.users[2].name;
      }
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
      row[columnNameToNumber['Class Period']] = userInfo.periodName;
    }

    row[columnNameToNumber['#']] = rowCounter;
    row[columnNameToNumber['Project ID']] = this.ConfigService.getProjectId();
    row[columnNameToNumber['Project Name']] = this.ProjectService.getProjectTitle();
    row[columnNameToNumber['Run ID']] = this.ConfigService.getRunId();

    if (componentState.serverSaveTime != null) {
      row[
        columnNameToNumber['Server Timestamp']
      ] = this.UtilService.convertMillisecondsToFormattedDateTime(componentState.serverSaveTime);
    }

    if (componentState.clientSaveTime != null) {
      const clientSaveTime = new Date(componentState.clientSaveTime);
      row[columnNameToNumber['Client Timestamp']] =
        clientSaveTime.toDateString() + ' ' + clientSaveTime.toLocaleTimeString();
    }

    row[columnNameToNumber['Node ID']] = nodeId;
    row[columnNameToNumber['Step Title']] = this.ProjectService.getNodePositionAndTitleByNodeId(
      nodeId
    );
    row[columnNameToNumber['Component Part Number']] =
      this.ProjectService.getComponentPositionByNodeIdAndComponentId(nodeId, componentId) + 1;
    row[columnNameToNumber['Component ID']] = component.id;
    row[columnNameToNumber['Component Type']] = component.type;
    row[columnNameToNumber['Component Prompt']] = this.UtilService.removeHTMLTags(component.prompt);
    row[columnNameToNumber['Student Data']] = componentState.studentData;
    row[columnNameToNumber['Student Work ID']] = componentState.id;
    row[columnNameToNumber['Thread ID']] = threadId;
    row[columnNameToNumber['Workgroup ID']] = workgroupId;
    row[columnNameToNumber['Post Level']] = this.getPostLevel(componentState);
    row[columnNameToNumber['Post Text']] = this.UtilService.removeHTMLTags(
      componentState.studentData.response
    );
    return row;
  }

  getStructuredPosts(componentStates) {
    const structuredPosts = {};
    for (let componentState of componentStates) {
      if (this.isTopLevelPost(componentState)) {
        structuredPosts[componentState.id] = componentState;
      } else if (this.isReply(componentState)) {
        this.addReplyToTopLevelPost(structuredPosts, componentState);
      }
    }
    return structuredPosts;
  }

  isTopLevelPost(componentState) {
    return componentState.studentData.componentStateIdReplyingTo == null;
  }

  isReply(componentState) {
    return componentState.studentData.componentStateIdReplyingTo != null;
  }

  addReplyToTopLevelPost(structuredPosts, replyComponentState) {
    const parentComponentStateId = replyComponentState.studentData.componentStateIdReplyingTo;
    const parentPost = structuredPosts[parentComponentStateId];
    if (parentPost.replies == null) {
      parentPost.replies = [];
    }
    parentPost.replies.push(replyComponentState);
  }

  getPostLevel(componentState) {
    if (this.isTopLevelPost(componentState)) {
      return 1;
    } else if (this.isReply(componentState)) {
      return 2;
    }
  }

  generateDiscussionExportFileName(nodeId, componentId) {
    const runId = this.ConfigService.getRunId();
    const stepNumber = this.ProjectService.getNodePositionById(nodeId);
    const componentNumber =
      this.ProjectService.getComponentPositionByNodeIdAndComponentId(nodeId, componentId) + 1;
    return runId + '_step_' + stepNumber + '_component_' + componentNumber + '_discussion_work.csv';
  }

  /**
   * Generate an export for a specific match component.
   * TODO: Move these Match export functions to the MatchService.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  exportMatchComponent(nodeId: string, component: any) {
    const components = this.getComponentsParam(nodeId, component.id);
    this.DataExportService.retrieveStudentDataExport(components).then((result: any) => {
      this.generateMatchComponentExport(nodeId, component);
    });
  }

  generateMatchComponentExport(nodeId: string, component: any) {
    const rows = this.getExportMatchComponentRows(nodeId, component);
    const fileName = this.getComponentExportFileName(nodeId, component.id, 'match');
    this.generateCSVFile(rows, fileName);
    this.hideDownloadingExportMessage();
  }

  getExportMatchComponentRows(nodeId: string, component: any) {
    const columnNames = [];
    const columnNameToNumber = {};
    let rows = [];
    rows.push(this.generateMatchComponentHeaderRow(component, columnNames, columnNameToNumber));
    rows = rows.concat(
      this.generateComponentWorkRows(component, columnNames, columnNameToNumber, nodeId)
    );
    return rows;
  }

  /**
   * Populate the array of header column names.
   * Populate the mappings of column name to column number.
   * @param component The component content object.
   * @param columnNames An array that we will populate with column names.
   * @param columnNameToNumber An object that we will populate with mappings
   * of column name to column number.
   */
  populateMatchColumnNames(component, columnNames, columnNameToNumber) {
    /*
     * Add the default column names that contain the information about the
     * student, project, run, node, and component.
     */
    for (const defaultMatchColumnName of this.componentExportDefaultColumnNames) {
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        defaultMatchColumnName
      );
    }
    for (const choice of component.choices) {
      columnNameToNumber[choice.id] = columnNames.length;
      columnNames.push(choice.value);
    }
    if (this.includeCorrectnessColumns && this.MatchService.hasCorrectAnswer(component)) {
      for (let choice of component.choices) {
        columnNameToNumber[choice.id + '-boolean'] = columnNames.length;
        columnNames.push(choice.value);
      }
      this.addColumnNameToColumnDataStructures(columnNameToNumber, columnNames, 'Is Correct');
    }
  }

  /**
   * Generate the header row.
   * @param component The component content object.
   * @param columnNames An array of column names.
   * @param columnNameToNumber An object containing the mappings from column
   * name to column number.
   */
  generateMatchComponentHeaderRow(component, columnNames, columnNameToNumber) {
    this.populateMatchColumnNames(component, columnNames, columnNameToNumber);
    return columnNames;
  }

  /**
   * Generate the row for the component state.
   * @param component The component content object.
   * @param columnNames All the header column names.
   * @param columnNameToNumber The mapping from column name to column number.
   * @param rowCounter The current row number.
   * @param workgroupId The workgroup id.
   * @param userId1 The User ID 1.
   * @param userId2 The User ID 2.
   * @param userId3 The User ID 3.
   * @param periodName The period name.
   * @param componentRevisionCounter The mapping of component to revision counter.
   * @param matchComponentState The component state.
   * @return The row with the student work.
   */
  generateMatchComponentWorkRow(
    component,
    columnNames,
    columnNameToNumber,
    rowCounter,
    workgroupId,
    userId1,
    userId2,
    userId3,
    studentName1,
    studentName2,
    studentName3,
    periodName,
    componentRevisionCounter,
    matchComponentState
  ) {
    /*
     * Populate the cells in the row that contain the information about the
     * student, project, run, step, and component.
     */
    let row = this.createStudentWorkExportRow(
      columnNames,
      columnNameToNumber,
      rowCounter,
      workgroupId,
      userId1,
      userId2,
      userId3,
      studentName1,
      studentName2,
      studentName3,
      periodName,
      componentRevisionCounter,
      matchComponentState
    );
    for (const bucket of matchComponentState.studentData.buckets) {
      for (const item of bucket.items) {
        row[columnNameToNumber[item.id]] = this.getBucketValueById(component, bucket.id);
        if (this.includeCorrectnessColumns && this.MatchService.hasCorrectAnswer(component)) {
          this.setCorrectnessValue(row, columnNameToNumber, item);
        }
      }
    }
    return row;
  }

  getBucketValueById(component: any, id: string): string {
    if (id === '0') {
      return component.choicesLabel ? component.choicesLabel : 'Choices';
    }
    const bucket = component.buckets.find((bucket: any) => {
      return bucket.id === id;
    });
    return bucket ? bucket.value : '';
  }

  /**
   * Set the correctness boolean value into the cell.
   * @param row The row we are working on.
   * @param columnNameToNumber The mapping from column name to column number.
   * @param item The choice object.
   */
  setCorrectnessValue(row, columnNameToNumber, item) {
    const columnName = item.id + '-boolean';
    if (item.isCorrect == null) {
      /*
       * The item does not have an isCorrect field so we will not show
       * anything in the cell.
       */
    } else if (item.isCorrect) {
      row[columnNameToNumber[columnName]] = 1;
    } else {
      if (item.isIncorrectPosition) {
        row[columnNameToNumber[columnName]] = 2;
      } else {
        row[columnNameToNumber[columnName]] = 0;
      }
    }
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

  exportDialogGuidanceComponent(nodeId: string, component: any): void {
    const components = this.getComponentsParam(nodeId, component.id);
    this.DataExportService.retrieveStudentDataExport(components).then((result: any) => {
      this.generateDialogGuidanceComponentExport(nodeId, component);
    });
  }

  generateDialogGuidanceComponentExport(nodeId: string, component: any): void {
    const rows = this.getExportDialogGuidanceComponentRows(nodeId, component);
    const fileName = this.getComponentExportFileName(nodeId, component.id, 'dialog_guidance');
    this.generateCSVFile(rows, fileName);
    this.hideDownloadingExportMessage();
  }

  exportOpenResponseComponent(nodeId: string, component: any): void {
    const components = this.getComponentsParam(nodeId, component.id);
    this.DataExportService.retrieveStudentDataExport(components).then(() => {
      this.generateOpenResponseComponentExport(nodeId, component);
    });
  }

  generateOpenResponseComponentExport(nodeId: string, component: any): void {
    const rows = this.getExportOpenResponseComponentRows(nodeId, component);
    const fileName = this.getComponentExportFileName(nodeId, component.id, 'open_response');
    this.generateCSVFile(rows, fileName);
    this.hideDownloadingExportMessage();
  }

  getExportOpenResponseComponentRows(nodeId: string, component: any): string[] {
    const columnNames = [];
    const columnNameToNumber = {};
    let rows = [];
    rows.push(
      this.generateOpenResponseComponentHeaderRow(
        component,
        columnNames,
        columnNameToNumber,
        nodeId
      )
    );
    rows = rows.concat(
      this.generateComponentWorkRows(component, columnNames, columnNameToNumber, nodeId)
    );
    return rows;
  }

  generateOpenResponseComponentHeaderRow(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[] {
    this.populateOpenResponseColumnNames(component, columnNames, columnNameToNumber, nodeId);
    return columnNames;
  }

  populateOpenResponseColumnNames(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): void {
    for (const defaultColumnName of this.componentExportDefaultColumnNames) {
      this.addColumnNameToColumnDataStructures(columnNameToNumber, columnNames, defaultColumnName);
    }
    this.addColumnNameToColumnDataStructures(columnNameToNumber, columnNames, this.itemIdLabel);
    this.addColumnNameToColumnDataStructures(
      columnNameToNumber,
      columnNames,
      this.studentResponseLabel
    );
    if (this.isCRaterEnabled(component)) {
      const annotations = this.TeacherDataService.getAnnotationsByNodeIdAndComponentId(
        nodeId,
        component.id
      );
      this.tryToAddIdeaColumnNames(columnNames, columnNameToNumber, annotations);
      this.tryToAddScoreColumnNames(columnNames, columnNameToNumber, annotations);
    }
  }

  isCRaterEnabled(component: any): boolean {
    return component.enableCRater && component.cRater.itemId !== '';
  }

  tryToAddIdeaColumnNames(
    columnNames: string[],
    columnNameToNumber: any,
    annotations: any[]
  ): void {
    const ideaNames = this.getIdeaNamesFromAnnotations(annotations);
    for (const ideaName of ideaNames) {
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        `${this.ideaLabel} ${ideaName}`
      );
    }
  }

  getIdeaNamesFromAnnotations(annotations: any[]): string[] {
    const ideaNames = new Set();
    for (const annotation of annotations) {
      const ideaNamesFromAnnotation = this.getIdeaNamesFromAnnotation(annotation);
      for (const ideaName of ideaNamesFromAnnotation) {
        ideaNames.add(ideaName);
      }
    }
    return Array.from(ideaNames).sort(this.sortIdeaNames) as string[];
  }

  getIdeaNamesFromAnnotation(annotation: any): string[] {
    const ideaNames = [];
    if (annotation.data.ideas != null) {
      for (const idea of annotation.data.ideas) {
        ideaNames.push(idea.name);
      }
    }
    return ideaNames;
  }

  tryToAddScoreColumnNames(
    columnNames: string[],
    columnNameToNumber: any,
    annotations: any[]
  ): void {
    const scoreNames = this.getScoreNamesFromAnnotations(annotations);
    if (scoreNames.length === 0) {
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        `${this.autoScoreLabel}`
      );
    } else {
      for (const scoreName of scoreNames) {
        this.addColumnNameToColumnDataStructures(
          columnNameToNumber,
          columnNames,
          `${this.scoreLabel} ${scoreName}`
        );
      }
    }
  }

  getScoreNamesFromAnnotations(annotations: any[]): string[] {
    const scoreNames = new Set();
    for (const annotation of annotations) {
      const scoreNamesFromAnnotation = this.getScoreNamesFromAnnotation(annotation);
      for (const scoreName of scoreNamesFromAnnotation) {
        scoreNames.add(scoreName);
      }
    }
    return Array.from(scoreNames).sort() as string[];
  }

  getScoreNamesFromAnnotation(annotation: any): string[] {
    const scoreNames = [];
    if (annotation.data.scores != null) {
      for (const score of annotation.data.scores) {
        scoreNames.push(score.id);
      }
    }
    return scoreNames.sort();
  }

  getComponentExportFileName(nodeId: string, componentId: string, componentType: string): string {
    const runId = this.ConfigService.getRunId();
    const stepNumber = this.ProjectService.getNodePositionById(nodeId);
    const componentNumber =
      this.ProjectService.getComponentPositionByNodeIdAndComponentId(nodeId, componentId) + 1;
    let allOrLatest = '';
    if (this.workSelectionType === 'exportAllWork') {
      allOrLatest = 'all';
    } else if (this.workSelectionType === 'exportLatestWork') {
      allOrLatest = 'latest';
    }
    return `run_${runId}_step_${stepNumber}_component_${componentNumber}_${allOrLatest}_${componentType}_work.csv`;
  }

  getExportDialogGuidanceComponentRows(nodeId: string, component: any): string[] {
    const columnNames = [];
    const columnNameToNumber = {};
    let rows = [];
    rows.push(
      this.generateDialogGuidanceComponentHeaderRow(component, columnNames, columnNameToNumber)
    );
    rows = rows.concat(
      this.generateComponentWorkRows(component, columnNames, columnNameToNumber, nodeId)
    );
    return rows;
  }

  generateDialogGuidanceComponentHeaderRow(
    component: any,
    columnNames: string[],
    columnNameToNumber: any
  ): string[] {
    this.populateDialogGuidanceColumnNames(component, columnNames, columnNameToNumber);
    return columnNames;
  }

  populateDialogGuidanceColumnNames(
    component: any,
    columnNames: string[],
    columnNameToNumber: any
  ): void {
    for (const defaultColumnName of this.componentExportDefaultColumnNames) {
      this.addColumnNameToColumnDataStructures(columnNameToNumber, columnNames, defaultColumnName);
    }
    this.addColumnNameToColumnDataStructures(columnNameToNumber, columnNames, this.itemIdLabel);
    const componentStates = this.TeacherDataService.getComponentStatesByComponentId(component.id);
    const ideaNames = this.getDialogGuidanceIdeaNames(componentStates);
    const scoreNames = this.getDialogGuidanceScoreNames(componentStates);
    for (let r = 0; r < this.getMaxNumberOfStudentResponses(componentStates); r++) {
      const revisionNumber = `${this.dialogGuidanceRevisionLabel} ${r + 1}`;
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        `${this.studentResponseLabel} ${revisionNumber}`
      );
      for (const ideaName of ideaNames) {
        this.addColumnNameToColumnDataStructures(
          columnNameToNumber,
          columnNames,
          `${this.ideaLabel} ${ideaName} ${revisionNumber}`
        );
      }
      for (const scoreName of scoreNames) {
        this.addColumnNameToColumnDataStructures(
          columnNameToNumber,
          columnNames,
          `${this.scoreLabel} ${scoreName} ${revisionNumber}`
        );
      }
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        `${this.dialogGuidanceComputerResponseLabel} ${revisionNumber}`
      );
    }
  }

  addColumnNameToColumnDataStructures(
    columnNameToNumber: any,
    columnNames: string[],
    columnName: string
  ): void {
    columnNameToNumber[columnName] = columnNames.length;
    columnNames.push(columnName);
  }

  getDialogGuidanceIdeaNames(componentStates: any[]): string[] {
    for (const componentState of componentStates) {
      for (const response of componentState.studentData.responses) {
        if (response.ideas != null && response.ideas.length > 0) {
          return this.getIdeaNamesFromIdeas(response.ideas);
        }
      }
    }
    return [];
  }

  getIdeaNamesFromIdeas(ideas: any[]): string[] {
    const ideaNames = [];
    for (const idea of ideas) {
      ideaNames.push(idea.name);
    }
    return ideaNames.sort(this.sortIdeaNames);
  }

  sortIdeaNames(a: any, b: any): number {
    const aInt = parseInt(a);
    const bInt = parseInt(b);
    // if a and b are the same number but one of them contains a letter, we will sort alphabetically
    // when a string like "5a" is given to parseInt(), it will return 5
    // therefore if we are comparing "5" and "5a" we will sort alphabetically because we want
    // 5 to show up before 5a
    if (!isNaN(aInt) && !isNaN(bInt) && aInt !== bInt) {
      // sort numerically
      return aInt - bInt;
    } else {
      // sort alphabetically
      return a.localeCompare(b);
    }
  }

  getDialogGuidanceScoreNames(componentStates: any[]): string[] {
    for (const componentState of componentStates) {
      for (const response of componentState.studentData.responses) {
        if (response.scores != null && response.scores.length > 0) {
          return this.getScoreNamesFromScores(response.scores);
        }
      }
    }
    return [];
  }

  getScoreNamesFromScores(scores: any[]): string[] {
    const scoreNames = [];
    for (const score of scores) {
      scoreNames.push(score.id);
    }
    return scoreNames.sort();
  }

  getMaxNumberOfStudentResponses(componentStates: any[]): number {
    let maxNumberOfResponses = 0;
    for (const componentState of componentStates) {
      const numberOfStudentResponses = this.getNumberOfStudentResponses(componentState);
      if (numberOfStudentResponses > maxNumberOfResponses) {
        maxNumberOfResponses = numberOfStudentResponses;
      }
    }
    return maxNumberOfResponses;
  }

  getNumberOfStudentResponses(componentState: any): number {
    let count = 0;
    for (const response of componentState.studentData.responses) {
      if (response.user === 'Student') {
        count++;
      }
    }
    return count;
  }

  generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[] {
    const componentId = component.id;
    let rows = [];
    let rowCounter = 1;
    for (const workgroupId of this.ConfigService.getClassmateWorkgroupIds()) {
      const rowsForWorkgroup = this.generateWorkgroupComponentWorkRows(
        component,
        workgroupId,
        columnNames,
        columnNameToNumber,
        nodeId,
        componentId,
        rowCounter
      );
      rows = rows.concat(rowsForWorkgroup);
      rowCounter += rowsForWorkgroup.length;
    }
    return rows;
  }

  generateWorkgroupComponentWorkRows(
    component: any,
    workgroupId: number,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string,
    componentId: string,
    rowCounter: number
  ): string[] {
    return this.generateComponentWorkRowsForWorkgroup(
      component,
      workgroupId,
      columnNames,
      columnNameToNumber,
      nodeId,
      componentId,
      rowCounter
    );
  }

  generateComponentWorkRowsForWorkgroup(
    component: any,
    workgroupId: number,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string,
    componentId: string,
    rowCounter: number
  ): string[] {
    const rows = [];
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);
    const extractedUserIDsAndStudentNames = this.extractUserIDsAndStudentNames(userInfo.users);

    // A mapping from component to component revision counter. The key will be
    // {{nodeId}}_{{componentId}} and the value will be a number.
    const componentRevisionCounter = {};
    const componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      componentId
    );
    for (let c = 0; c < componentStates.length; c++) {
      const componentState = componentStates[c];
      if (this.shouldExportRow(componentState, c, componentStates.length)) {
        const row = this.generateComponentWorkRow(
          component,
          columnNames,
          columnNameToNumber,
          rowCounter,
          workgroupId,
          extractedUserIDsAndStudentNames['userId1'],
          extractedUserIDsAndStudentNames['userId2'],
          extractedUserIDsAndStudentNames['userId3'],
          extractedUserIDsAndStudentNames['studentName1'],
          extractedUserIDsAndStudentNames['studentName2'],
          extractedUserIDsAndStudentNames['studentName3'],
          userInfo.periodName,
          componentRevisionCounter,
          componentState
        );
        rows.push(row);
        rowCounter++;
      } else {
        // We do not want to add this component state as a row in the export but we still want to
        // increment the revision counter.
        this.incrementRevisionCounter(componentRevisionCounter, nodeId, componentId);
      }
    }
    return rows;
  }

  shouldExportRow(
    componentState: any,
    componentStateIndex: number,
    numComponentStates: number
  ): boolean {
    let exportRow = true;
    if (this.includeOnlySubmits && !componentState.isSubmit) {
      exportRow = false;
    } else if (
      this.workSelectionType === 'exportLatestWork' &&
      componentStateIndex != numComponentStates - 1
    ) {
      exportRow = false;
    }
    return exportRow;
  }

  generateComponentWorkRow(
    component: any,
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
    if (componentState.componentType === 'Match') {
      return this.generateMatchComponentWorkRow(
        component,
        columnNames,
        columnNameToNumber,
        rowCounter,
        workgroupId,
        userId1,
        userId2,
        userId3,
        studentName1,
        studentName2,
        studentName3,
        periodName,
        componentRevisionCounter,
        componentState
      );
    } else if (componentState.componentType === 'DialogGuidance') {
      return this.generateDialogGuidanceComponentWorkRow(
        component,
        columnNames,
        columnNameToNumber,
        rowCounter,
        workgroupId,
        userId1,
        userId2,
        userId3,
        studentName1,
        studentName2,
        studentName3,
        periodName,
        componentRevisionCounter,
        componentState
      );
    } else if (componentState.componentType === 'OpenResponse') {
      return this.generateOpenResponseComponentWorkRow(
        component,
        columnNames,
        columnNameToNumber,
        rowCounter,
        workgroupId,
        userId1,
        userId2,
        userId3,
        studentName1,
        studentName2,
        studentName3,
        periodName,
        componentRevisionCounter,
        componentState
      );
    } else if (this.isEmbeddedTableComponentAndCanExport(component)) {
      return this.generateEmbeddedComponentWorkRow(
        component,
        columnNames,
        columnNameToNumber,
        rowCounter,
        workgroupId,
        userId1,
        userId2,
        userId3,
        studentName1,
        studentName2,
        studentName3,
        periodName,
        componentRevisionCounter,
        componentState
      );
    }
  }

  generateDialogGuidanceComponentWorkRow(
    component: any,
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
    dialogGuidanceComponentState: any
  ): string[] {
    // Populate the cells in the row that contain the information about the student, project, run,
    // step, and component.
    let row = this.createStudentWorkExportRow(
      columnNames,
      columnNameToNumber,
      rowCounter,
      workgroupId,
      userId1,
      userId2,
      userId3,
      studentName1,
      studentName2,
      studentName3,
      periodName,
      componentRevisionCounter,
      dialogGuidanceComponentState
    );
    row[columnNameToNumber[this.itemIdLabel]] = component.itemId;
    let revisionCounter = 0;
    let revisionLabel = '';
    for (const response of dialogGuidanceComponentState.studentData.responses) {
      if (response.user === 'Student') {
        revisionCounter++;
        revisionLabel = `${this.dialogGuidanceRevisionLabel} ${revisionCounter}`;
        this.addDialogGuidanceStudentResponseToRow(
          row,
          columnNameToNumber,
          revisionLabel,
          response.text
        );
      } else if (response.user === 'Computer') {
        if (response.ideas != null) {
          this.addDialogGuidanceIdeasToRow(row, columnNameToNumber, revisionLabel, response.ideas);
        }
        if (response.scores != null) {
          this.addDialogGuidanceScoresToRow(
            row,
            columnNameToNumber,
            revisionLabel,
            response.scores
          );
        }
        this.addDialogGuidanceComputerResponseToRow(
          row,
          columnNameToNumber,
          revisionLabel,
          response.text
        );
      }
    }
    return row;
  }

  addDialogGuidanceStudentResponseToRow(
    row: any[],
    columnNameToNumber: any,
    revisionLabel: string,
    text: string
  ): void {
    row[columnNameToNumber[`${this.studentResponseLabel} ${revisionLabel}`]] = text;
  }

  addDialogGuidanceIdeasToRow(
    row: any[],
    columnNameToNumber: any,
    revisionLabel: string,
    ideas: any[]
  ): void {
    for (const ideaObject of ideas) {
      row[
        columnNameToNumber[`${this.ideaLabel} ${ideaObject.name} ${revisionLabel}`]
      ] = ideaObject.detected ? 1 : 0;
    }
  }

  addDialogGuidanceScoresToRow(
    row: any[],
    columnNameToNumber: any,
    revisionLabel: string,
    scores: any[]
  ): void {
    for (const scoreObject of scores) {
      row[columnNameToNumber[`${this.scoreLabel} ${scoreObject.id} ${revisionLabel}`]] =
        scoreObject.score;
    }
  }

  addDialogGuidanceComputerResponseToRow(
    row: any[],
    columnNameToNumber: any,
    revisionLabel: string,
    text: string
  ): void {
    row[columnNameToNumber[`${this.dialogGuidanceComputerResponseLabel} ${revisionLabel}`]] = text;
  }

  generateOpenResponseComponentWorkRow(
    component: any,
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
    const row = this.createStudentWorkExportRow(
      columnNames,
      columnNameToNumber,
      rowCounter,
      workgroupId,
      userId1,
      userId2,
      userId3,
      studentName1,
      studentName2,
      studentName3,
      periodName,
      componentRevisionCounter,
      componentState
    );
    row[columnNameToNumber[this.itemIdLabel]] = component?.cRater?.itemId;
    row[columnNameToNumber[this.studentResponseLabel]] = componentState.studentData.response;
    const annotation = this.AnnotationService.getLatestAnnotationByStudentWorkIdAndType(
      componentState.id,
      'autoScore'
    );
    if (annotation != null) {
      this.tryToAddOpenResponseAnnotationIdeas(row, columnNameToNumber, annotation);
      this.tryToAddOpenResponseAnnotationScores(row, columnNameToNumber, annotation);
    }
    return row;
  }

  tryToAddOpenResponseAnnotationIdeas(row: any[], columnNameToNumber: any, annotation: any): void {
    if (annotation.data.ideas != null) {
      for (const idea of annotation.data.ideas) {
        row[columnNameToNumber[`${this.ideaLabel} ${idea.name}`]] = idea.detected ? 1 : 0;
      }
    }
  }

  tryToAddOpenResponseAnnotationScores(row: any[], columnNameToNumber: any, annotation: any): void {
    if (annotation.data.scores != null) {
      for (const score of annotation.data.scores) {
        row[columnNameToNumber[`${this.scoreLabel} ${score.id}`]] = score.score;
      }
    }
    if (annotation.data.value != null) {
      row[columnNameToNumber[`${this.autoScoreLabel}`]] = annotation.data.value;
    }
  }

  exportEmbeddedComponent(nodeId: string, component: any): void {
    const components = this.getComponentsParam(nodeId, component.id);
    this.DataExportService.retrieveStudentDataExport(components).then((result: any) => {
      this.generateEmbeddedComponentExport(nodeId, component);
    });
  }

  generateEmbeddedComponentExport(nodeId: string, component: any): void {
    const rows = this.getExportEmbeddedComponentRows(nodeId, component);
    const fileName = this.getComponentExportFileName(nodeId, component.id, 'embedded');
    this.generateCSVFile(rows, fileName);
    this.hideDownloadingExportMessage();
  }

  getExportEmbeddedComponentRows(nodeId: string, component: any): string[] {
    const columnNames = [];
    const columnNameToNumber = {};
    let rows = [];
    rows.push(this.generateEmbeddedComponentHeaderRow(component, columnNames, columnNameToNumber));
    rows = rows.concat(
      this.generateComponentWorkRows(component, columnNames, columnNameToNumber, nodeId)
    );
    return rows;
  }

  generateEmbeddedComponentHeaderRow(
    component: any,
    columnNames: string[],
    columnNameToNumber: any
  ): string[] {
    this.populateEmbeddedColumnNames(component, columnNames, columnNameToNumber);
    return columnNames;
  }

  populateEmbeddedColumnNames(
    component: any,
    columnNames: string[],
    columnNameToNumber: any
  ): void {
    for (const defaultMatchColumnName of this.componentExportDefaultColumnNames) {
      this.addColumnNameToColumnDataStructures(
        columnNameToNumber,
        columnNames,
        defaultMatchColumnName
      );
    }
    const componentStates = this.TeacherDataService.getComponentStatesByComponentId(component.id);
    const items = this.getEmbeddedTableRowItems(component, componentStates);
    const columnKeys = this.getEmbeddedTableColumnKeys(component);
    if (this.isEmbeddedTableComponentAndCanExport(component)) {
      for (const item of items) {
        columnKeys.forEach((columnKey) => {
          this.addColumnNameToColumnDataStructures(
            columnNameToNumber,
            columnNames,
            `${item} ${this.embeddedTableKeyToValue[columnKey]}`
          );
        });
      }
    }
  }

  getEmbeddedTableColumnKeys(component: any): string[] {
    let columnKeys = [];
    if (this.isDevicesEmbeddedTable(component)) {
      columnKeys = ['current', 'future', 'kwhsaved', 'co2saved'];
    } else if (this.isTransporationEmbeddedTable(component)) {
      columnKeys = ['minutes', 'current', 'future', 'co2saved'];
    }
    return columnKeys;
  }

  getEmbeddedTableRowItems(component: any, componentStates: any[]): string[] {
    if (this.isDevicesEmbeddedTable(component)) {
      return this.getDevices(componentStates);
    } else if (this.isTransporationEmbeddedTable(component)) {
      return this.getTransportationMethods(componentStates);
    }
  }

  getDevices(componentStates: any[]): string[] {
    const devices = [];
    for (const row of componentStates[0].studentData.tableData) {
      devices.push(row.appliance);
    }
    return devices;
  }

  getTransportationMethods(componentStates: any[]): string[] {
    const transportation = [];
    for (const row of componentStates[0].studentData.tableData) {
      transportation.push(row.method);
    }
    return transportation;
  }

  generateEmbeddedComponentWorkRow(
    component: any,
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
    embeddedComponentState: any
  ): string[] {
    // Populate the cells in the row that contain the information about the student, project, run,
    // step, and component.
    const row = this.createStudentWorkExportRow(
      columnNames,
      columnNameToNumber,
      rowCounter,
      workgroupId,
      userId1,
      userId2,
      userId3,
      studentName1,
      studentName2,
      studentName3,
      periodName,
      componentRevisionCounter,
      embeddedComponentState
    );
    const columnKeys = this.getEmbeddedTableColumnKeys(component);
    for (const studentTableDataRow of embeddedComponentState.studentData.tableData) {
      const item = this.getEmbeddedTableRowItem(component, studentTableDataRow);
      for (const column of columnKeys) {
        this.addEmbeddedCellsToRow(
          row,
          columnNameToNumber,
          item,
          column,
          studentTableDataRow[column]
        );
      }
    }
    return row;
  }

  getEmbeddedTableRowItem(component: any, studentTableDataRow: any): string {
    if (this.isDevicesEmbeddedTable(component)) {
      return studentTableDataRow.appliance;
    } else if (this.isTransporationEmbeddedTable(component)) {
      return studentTableDataRow.method;
    }
  }

  addEmbeddedCellsToRow(
    row: any[],
    columnNameToNumber: any,
    device: string,
    column: string,
    text: string
  ): void {
    row[columnNameToNumber[`${device} ${this.embeddedTableKeyToValue[column]}`]] = text;
  }

  showDownloadingExportMessage() {
    this.$mdDialog.show({
      template: `
        <div align="center">
          <div style="width: 200px; height: 100px; margin: 20px;">
            <span>{{ 'downloadingExport' | translate }}</span>
            <br/>
            <br/>
            <md-progress-circular md-mode="indeterminate"></md-progress-circular>
          </div>
        </div>
      `,
      clickOutsideToClose: false
    });
  }

  hideDownloadingExportMessage() {
    this.$mdDialog.hide();
  }

  exportVisitsClicked() {
    this.$state.go('root.cm.exportVisits');
  }

  getComponentsParam(nodeId: string, componentId: string) {
    return [{ nodeId: nodeId, componentId: componentId }];
  }
}

export default DataExportController;
