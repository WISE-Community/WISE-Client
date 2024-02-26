import { removeHTMLTags } from '../../../common/string/string';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';

export class OneWorkgroupPerRowDataExportStrategy extends AbstractDataExportStrategy {
  /**
   * Create a csv export file with one workgroup per row
   */
  export() {
    this.controller.showDownloadingExportMessage();
    var selectedNodes = [];

    /*
     * holds the mappings from nodeid or nodeid-componentid to a boolean
     * value of whether the node was selected
     * example
     * selectedNodesMap["node3"] = true
     * selectedNodesMap["node4-wt38sdf1d3"] = true
     */
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

    this.dataExportService.retrieveStudentData(selectedNodes, true, true, true).subscribe(() => {
      var rows = [];
      var projectId = this.configService.getProjectId();
      var projectTitle = this.projectService.getProjectTitle();
      var runId = this.configService.getRunId();
      var startDate = '';
      var endDate = '';
      var columnIds = this.getColumnIdsForOneWorkgroupPerRow(selectedNodesMap);
      var nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
      var descriptionRowHeaders = [
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
        'End Date'
      ];
      var columnIdToColumnIndex = this.getColumnIdToColumnIndex(columnIds, descriptionRowHeaders);
      var topRows = this.getOneWorkgroupPerRowTopRows(
        columnIds,
        columnIdToColumnIndex,
        descriptionRowHeaders
      );
      rows = rows.concat(topRows);
      for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
        /*
         * Create the row for the workgroup and fill each cell with
         * a space " ".
         * The array length will be equal to the number of
         * description header columns plus a column for the vertical
         * headers plus all the columns for the steps/components.
         */
        var workgroupRow = new Array(descriptionRowHeaders.length + 1 + columnIds.length);
        workgroupRow.fill(' ');
        var userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
        workgroupRow[columnIdToColumnIndex['Workgroup ID']] = workgroupId;
        var extractedUserIDsAndStudentNames = this.controller.extractUserIDsAndStudentNames(
          userInfo.users
        );
        var userId1 = extractedUserIDsAndStudentNames['userId1'];
        var userId2 = extractedUserIDsAndStudentNames['userId2'];
        var userId3 = extractedUserIDsAndStudentNames['userId3'];
        var studentName1 = extractedUserIDsAndStudentNames['studentName1'];
        var studentName2 = extractedUserIDsAndStudentNames['studentName2'];
        var studentName3 = extractedUserIDsAndStudentNames['studentName3'];
        if (userId1 != null) {
          workgroupRow[columnIdToColumnIndex['User ID 1']] = userId1;
        }
        if (studentName1 != null && this.controller.includeStudentNames) {
          workgroupRow[columnIdToColumnIndex['Student Name 1']] = studentName1;
        }
        if (userId2 != null) {
          workgroupRow[columnIdToColumnIndex['User ID 2']] = userId2;
        }
        if (studentName2 != null && this.controller.includeStudentNames) {
          workgroupRow[columnIdToColumnIndex['Student Name 2']] = studentName2;
        }
        if (userId3 != null) {
          workgroupRow[columnIdToColumnIndex['User ID 3']] = userId3;
        }
        if (studentName3 != null && this.controller.includeStudentNames) {
          workgroupRow[columnIdToColumnIndex['Student Name 3']] = studentName3;
        }
        workgroupRow[columnIdToColumnIndex['Class Period']] = userInfo.periodName;
        workgroupRow[columnIdToColumnIndex['Project ID']] = projectId;
        workgroupRow[columnIdToColumnIndex['Project Name']] = projectTitle;
        workgroupRow[columnIdToColumnIndex['Run ID']] = runId;
        workgroupRow[columnIdToColumnIndex['Start Date']] = startDate;
        workgroupRow[columnIdToColumnIndex['End Date']] = endDate;
        for (var n = 0; n < nodeIds.length; n++) {
          var nodeId = nodeIds[n];
          var components = this.projectService.getComponents(nodeId);
          if (components != null) {
            for (var c = 0; c < components.length; c++) {
              var component = components[c];
              if (component != null) {
                var componentId = component.id;
                if (this.exportComponent(selectedNodesMap, nodeId, componentId)) {
                  var columnIdPrefix = nodeId + '-' + componentId;
                  var componentState = this.teacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
                    workgroupId,
                    nodeId,
                    componentId
                  );
                  if (componentState != null) {
                    if (this.controller.includeStudentWorkIds) {
                      workgroupRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] =
                        componentState.id;
                    }
                    if (this.controller.includeStudentWorkTimestamps) {
                      if (componentState.serverSaveTime != null) {
                        var formattedDateTime = millisecondsToDateTime(
                          componentState.serverSaveTime
                        );
                        workgroupRow[
                          columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']
                        ] = formattedDateTime;
                      }
                    }
                    workgroupRow[
                      columnIdToColumnIndex[columnIdPrefix + '-studentWork']
                    ] = this.getStudentDataString(componentState);
                    if (this.controller.includeScores || this.controller.includeComments) {
                      var latestComponentAnnotations = this.annotationService.getLatestComponentAnnotations(
                        nodeId,
                        componentId,
                        workgroupId
                      );
                      if (latestComponentAnnotations != null) {
                        var scoreAnnotation = latestComponentAnnotations.score;
                        var commentAnnotation = latestComponentAnnotations.comment;
                        if (scoreAnnotation != null) {
                          if (this.controller.includeScoreTimestamps) {
                            var scoreTimestamp = millisecondsToDateTime(
                              scoreAnnotation.serverSaveTime
                            );
                            workgroupRow[
                              columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']
                            ] = scoreTimestamp;
                          }
                          if (this.controller.includeScores) {
                            if (
                              scoreAnnotation.data != null &&
                              scoreAnnotation.data.value != null
                            ) {
                              var scoreValue = scoreAnnotation.data.value;
                              workgroupRow[
                                columnIdToColumnIndex[columnIdPrefix + '-score']
                              ] = scoreValue;
                            }
                          }
                        }
                        if (commentAnnotation != null) {
                          if (this.controller.includeCommentTimestamps) {
                            var commentTimestamp = millisecondsToDateTime(
                              commentAnnotation.serverSaveTime
                            );
                            workgroupRow[
                              columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']
                            ] = commentTimestamp;
                          }
                          if (this.controller.includeComments) {
                            if (
                              commentAnnotation.data != null &&
                              commentAnnotation.data.value != null
                            ) {
                              var commentValue = commentAnnotation.data.value;
                              workgroupRow[
                                columnIdToColumnIndex[columnIdPrefix + '-comment']
                              ] = commentValue;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (this.controller.exportNode(selectedNodesMap, nodeId)) {
            if (this.projectService.isBranchPoint(nodeId)) {
              var toNodeId = null;
              var stepTitle = null;
              var eventType = 'branchPathTaken';
              var latestBranchPathTakenEvent = this.teacherDataService.getLatestEventByWorkgroupIdAndNodeIdAndType(
                workgroupId,
                nodeId,
                eventType
              );
              if (
                latestBranchPathTakenEvent != null &&
                latestBranchPathTakenEvent.data != null &&
                latestBranchPathTakenEvent.data.toNodeId != null
              ) {
                toNodeId = latestBranchPathTakenEvent.data.toNodeId;
                stepTitle = this.projectService.getNodePositionAndTitle(toNodeId);
              }
              if (this.controller.includeBranchPathTakenNodeId) {
                if (toNodeId != null) {
                  workgroupRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = toNodeId;
                } else {
                  workgroupRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = ' ';
                }
              }
              if (this.controller.includeBranchPathTaken) {
                var branchLetter = this.projectService.getBranchLetter(toNodeId);
                if (stepTitle != null) {
                  workgroupRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = branchLetter;
                } else {
                  workgroupRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = ' ';
                }
              }
              if (this.controller.includeBranchPathTakenStepTitle) {
                if (stepTitle != null) {
                  workgroupRow[
                    columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']
                  ] = stepTitle;
                } else {
                  workgroupRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = ' ';
                }
              }
            }
          }
        }
        rows.push(workgroupRow);
      }
      var fileName = runId + '_one_workgroup_per_row.csv';
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  /**
   * Check if we want to export this component
   * @param selectedNodesMap a mapping of node id to boolean value of whether
   * the researcher has checked the node
   * @param nodeId the node id
   * @param componentId the component id
   * @return whether the component was checked
   */
  private exportComponent(selectedNodesMap, nodeId, componentId) {
    return (
      selectedNodesMap == null ||
      this.controller.isComponentSelected(selectedNodesMap, nodeId, componentId)
    );
  }

  /**
   * Get the column ids for the One Workgroup Per Row export
   * @param selectedNodesMap the nodes that were selected
   * @return an array of column ids. the column ids will be in the format
   * nodeId-componentId-studentWork
   * nodeId-componentId-score
   * nodeId-componentId-comment
   */
  private getColumnIdsForOneWorkgroupPerRow(selectedNodesMap) {
    var columnIds = [];
    var nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    if (nodeIds != null) {
      for (var n = 0; n < nodeIds.length; n++) {
        var nodeId = nodeIds[n];
        var components = this.projectService.getComponents(nodeId);
        if (components != null) {
          for (var c = 0; c < components.length; c++) {
            var component = components[c];
            if (component != null) {
              var componentId = component.id;
              if (this.exportComponent(selectedNodesMap, nodeId, componentId)) {
                var columnIdPrefix = nodeId + '-' + componentId;
                if (this.controller.includeStudentWorkIds) {
                  columnIds.push(columnIdPrefix + '-studentWorkId');
                }
                if (this.controller.includeStudentWorkTimestamps) {
                  columnIds.push(columnIdPrefix + '-studentWorkTimestamp');
                }
                if (this.controller.includeStudentWork) {
                  columnIds.push(columnIdPrefix + '-studentWork');
                }
                if (this.controller.includeScoreTimestamps) {
                  columnIds.push(columnIdPrefix + '-scoreTimestamp');
                }
                if (this.controller.includeScores) {
                  columnIds.push(columnIdPrefix + '-score');
                }
                if (this.controller.includeCommentTimestamps) {
                  columnIds.push(columnIdPrefix + '-commentTimestamp');
                }
                if (this.controller.includeComments) {
                  columnIds.push(columnIdPrefix + '-comment');
                }
              }
            }
          }
        }
        if (this.controller.exportNode(selectedNodesMap, nodeId)) {
          if (this.projectService.isBranchPoint(nodeId)) {
            if (this.controller.includeBranchPathTakenNodeId) {
              columnIds.push(nodeId + '-branchPathTakenNodeId');
            }
            if (this.controller.includeBranchPathTaken) {
              columnIds.push(nodeId + '-branchPathTaken');
            }
            if (this.controller.includeBranchPathTakenStepTitle) {
              columnIds.push(nodeId + '-branchPathTakenStepTitle');
            }
          }
        }
      }
    }
    return columnIds;
  }

  /**
   * Get the top rows in the One Workgroup Per Row export
   * @param columnIds an array of column ids
   * @param columnIdToColumnIndex an object containing mappings from column id
   * to column index
   * @param descriptionRowHeaders an array containing the description row
   * headers
   * @return an array of of the top rows. each top row is also an array
   */
  private getOneWorkgroupPerRowTopRows(columnIds, columnIdToColumnIndex, descriptionRowHeaders) {
    var numColumns = descriptionRowHeaders.length + 1 + columnIds.length;
    var stepTitleRow = new Array(numColumns);
    var componentPartNumberRow = new Array(numColumns);
    var componentTypeRow = new Array(numColumns);
    var componentPromptRow = new Array(numColumns);
    var nodeIdRow = new Array(numColumns);
    var componentIdRow = new Array(numColumns);
    var columnIdRow = new Array(numColumns);
    var descriptionRow = new Array(numColumns);

    /*
     * populate the top rows with a space. we do this so that it makes it
     * easier to view in the export. for example if there is a cell with
     * text in it and a blank cell to the right of it, excel will display
     * the text overflow into the blank cell. if we have cells with " "
     * instead of "", this overflow will not occur.
     */
    stepTitleRow.fill(' ');
    componentPartNumberRow.fill(' ');
    componentTypeRow.fill(' ');
    componentPromptRow.fill(' ');
    nodeIdRow.fill(' ');
    componentIdRow.fill(' ');
    columnIdRow.fill(' ');
    descriptionRow.fill(' ');
    stepTitleRow[descriptionRowHeaders.length] = 'Step Title';
    componentPartNumberRow[descriptionRowHeaders.length] = 'Component Part Number';
    componentTypeRow[descriptionRowHeaders.length] = 'Component Type';
    componentPromptRow[descriptionRowHeaders.length] = 'Prompt';
    nodeIdRow[descriptionRowHeaders.length] = 'Node ID';
    componentIdRow[descriptionRowHeaders.length] = 'Component ID';
    columnIdRow[descriptionRowHeaders.length] = 'Column ID';
    descriptionRow[descriptionRowHeaders.length] = 'Description';
    for (var d = 0; d < descriptionRowHeaders.length; d++) {
      descriptionRow[d] = descriptionRowHeaders[d];
    }
    var nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    if (nodeIds != null) {
      for (var n = 0; n < nodeIds.length; n++) {
        var nodeId = nodeIds[n];
        var stepTitle = this.projectService.getNodePositionAndTitle(nodeId);
        var components = this.projectService.getComponents(nodeId);
        if (components != null) {
          for (var c = 0; c < components.length; c++) {
            var component = components[c];
            if (component != null) {
              var componentId = component.id;
              var columnIdPrefix = nodeId + '-' + componentId;
              var prompt = removeHTMLTags(component.prompt);
              prompt = prompt.replace(/"/g, '""');
              if (prompt == '') {
                prompt = ' ';
              }
              if (this.controller.includeStudentWorkIds) {
                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] = stepTitle;
                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] =
                  c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] =
                  component.type;
                componentPromptRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']
                ] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] = nodeId;
                componentIdRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']
                ] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] =
                  columnIdPrefix + '-studentWorkId';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkId']] =
                  'Student Work ID';
              }
              if (this.controller.includeStudentWorkTimestamps) {
                stepTitleRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']
                ] = stepTitle;
                componentPartNumberRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']
                ] = c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']] =
                  component.type;
                componentPromptRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']
                ] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']] = nodeId;
                componentIdRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']
                ] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']] =
                  columnIdPrefix + '-studentWorkTimestamp';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-studentWorkTimestamp']] =
                  'Student Work Timestamp';
              }
              if (this.controller.includeStudentWork) {
                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] = stepTitle;
                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] =
                  c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] =
                  component.type;
                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] = nodeId;
                componentIdRow[
                  columnIdToColumnIndex[columnIdPrefix + '-studentWork']
                ] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] =
                  columnIdPrefix + '-studentWork';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-studentWork']] =
                  'Student Work';
              }

              if (this.controller.includeScoreTimestamps) {
                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] = stepTitle;
                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] =
                  c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] =
                  component.type;
                componentPromptRow[
                  columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']
                ] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] = nodeId;
                componentIdRow[
                  columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']
                ] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] =
                  columnIdPrefix + '-scoreTimestamp';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-scoreTimestamp']] =
                  'Score Timestamp';
              }
              if (this.controller.includeScores) {
                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = stepTitle;
                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = component.type;
                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = nodeId;
                componentIdRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-score']] =
                  columnIdPrefix + '-score';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-score']] = 'Score';
              }
              if (this.controller.includeCommentTimestamps) {
                stepTitleRow[
                  columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']
                ] = stepTitle;
                componentPartNumberRow[
                  columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']
                ] = c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']] =
                  component.type;
                componentPromptRow[
                  columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']
                ] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']] = nodeId;
                componentIdRow[
                  columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']
                ] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']] =
                  columnIdPrefix + '-commentTimestamp';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-commentTimestamp']] =
                  'Comment Timestamp';
              }
              if (this.controller.includeComments) {
                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = stepTitle;
                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = c + 1;
                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] =
                  component.type;
                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = prompt;
                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = nodeId;
                componentIdRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = componentId;
                columnIdRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] =
                  columnIdPrefix + '-comment';
                descriptionRow[columnIdToColumnIndex[columnIdPrefix + '-comment']] = 'Comment';
              }
            }
          }
        }
        if (this.controller.includeBranchPathTakenNodeId) {
          if (this.projectService.isBranchPoint(nodeId)) {
            stepTitleRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = stepTitle;
            componentPartNumberRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = ' ';
            componentTypeRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = ' ';
            componentPromptRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = ' ';
            nodeIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = nodeId;
            componentIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] = ' ';
            columnIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] =
              nodeId + '-branchPathTakenNodeId';
            descriptionRow[columnIdToColumnIndex[nodeId + '-branchPathTakenNodeId']] =
              'Branch Path Taken Node ID';
          }
        }
        if (this.controller.includeBranchPathTaken) {
          if (this.projectService.isBranchPoint(nodeId)) {
            stepTitleRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = stepTitle;
            componentPartNumberRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = ' ';
            componentTypeRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = ' ';
            componentPromptRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = ' ';
            nodeIdRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = nodeId;
            componentIdRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] = ' ';
            columnIdRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] =
              nodeId + '-branchPathTaken';
            descriptionRow[columnIdToColumnIndex[nodeId + '-branchPathTaken']] =
              'Branch Path Taken';
          }
        }
        if (this.controller.includeBranchPathTakenStepTitle) {
          if (this.projectService.isBranchPoint(nodeId)) {
            stepTitleRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = stepTitle;
            componentPartNumberRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] =
              ' ';
            componentTypeRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = ' ';
            componentPromptRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = ' ';
            nodeIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = nodeId;
            componentIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] = ' ';
            columnIdRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] =
              nodeId + '-branchPathTakenStepTitle';
            descriptionRow[columnIdToColumnIndex[nodeId + '-branchPathTakenStepTitle']] =
              'Branch Path Taken Step Title';
          }
        }
      }
    }
    const topRows = [];
    topRows.push(stepTitleRow);
    topRows.push(componentPartNumberRow);
    topRows.push(componentTypeRow);
    topRows.push(componentPromptRow);
    topRows.push(nodeIdRow);
    topRows.push(componentIdRow);
    topRows.push(columnIdRow);
    topRows.push(descriptionRow);
    return topRows;
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
  private getColumnIdToColumnIndex(columnIds, descriptionRowHeaders) {
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
}
