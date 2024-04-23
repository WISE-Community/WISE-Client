import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { removeHTMLTags } from '../../../common/string/string';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';

export class StudentWorkDataExportStrategy extends AbstractDataExportStrategy {
  constructor(private exportType: string) {
    super();
  }

  export() {
    this.controller.showDownloadingExportMessage();
    var selectedNodes = [];
    var selectedNodesMap = null;
    if (this.controller.exportStepSelectionType === 'exportSelectSteps') {
      selectedNodes = this.controller.getSelectedNodesToExport();
      if (selectedNodes == null || selectedNodes.length == 0) {
        alert('Please select a step to export.');
        this.controller.hideDownloadingExportMessage();
        return;
      } else {
        selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
      }
    }
    this.dataExportService.retrieveStudentData(selectedNodes, true, false, true).subscribe(() => {
      var runId = this.configService.getRunId();
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
      for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
        var userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
        var extractedUserIDsAndStudentNames = this.controller.extractUserIDsAndStudentNames(
          userInfo.users
        );
        /*
         * a mapping from component to component revision counter.
         * the key will be {{nodeId}}_{{componentId}} and the
         * value will be a number.
         */
        var componentRevisionCounter = {};
        let componentStates = [];
        if (this.exportType === 'allStudentWork') {
          componentStates = this.teacherDataService.getComponentStatesByWorkgroupId(workgroupId);
        } else if (this.exportType === 'latestStudentWork') {
          this.teacherDataService.injectRevisionCounterIntoComponentStates(
            this.teacherDataService.getComponentStatesByWorkgroupId(workgroupId)
          );
          componentStates = this.teacherDataService.getLatestComponentStatesByWorkgroupId(
            workgroupId
          );
        }
        if (componentStates != null) {
          for (var c = 0; c < componentStates.length; c++) {
            var componentState = componentStates[c];
            if (componentState != null) {
              var exportRow = true;
              if (this.controller.exportStepSelectionType === 'exportSelectSteps') {
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
      if (this.exportType === 'allStudentWork') {
        fileName = runId + '_all_work.csv';
      } else if (this.exportType === 'latestStudentWork') {
        fileName = runId + '_latest_work.csv';
      }
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
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
    if (studentName1 != null && this.controller.includeStudentNames) {
      row[columnNameToNumber['Student Name 1']] = studentName1;
    }
    if (userId2 != null) {
      row[columnNameToNumber['User ID 2']] = userId2;
    }
    if (studentName2 != null && this.controller.includeStudentNames) {
      row[columnNameToNumber['Student Name 2']] = studentName2;
    }
    if (userId3 != null) {
      row[columnNameToNumber['User ID 3']] = userId3;
    }
    if (studentName3 != null && this.controller.includeStudentNames) {
      row[columnNameToNumber['Student Name 3']] = studentName3;
    }
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
}
