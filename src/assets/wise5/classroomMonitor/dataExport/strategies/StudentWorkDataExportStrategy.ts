import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

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
                  !this.controller.isComponentSelected(
                    selectedNodesMap,
                    componentState.nodeId,
                    componentState.componentId
                  )
                ) {
                  exportRow = false;
                }
              }
              if (exportRow) {
                var row = this.controller.createStudentWorkExportRow(
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
}
