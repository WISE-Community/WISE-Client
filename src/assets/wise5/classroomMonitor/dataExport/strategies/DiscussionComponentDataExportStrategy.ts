import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export class DiscussionComponentDataExportStrategy extends AbstractDataExportStrategy {
  constructor(private nodeId: string, private component: any) {
    super();
  }

  /**
   * Generate an export for a specific Discussion component.
   * TODO: Move these Discussion export functions to the DiscussionService.
   * @param nodeId The node id.
   * @param component The component content object.
   */
  export() {
    this.controller.showDownloadingExportMessage();
    const components = [{ nodeId: this.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentDataExport(components).then((result) => {
      const columnNames = [];
      const columnNameToNumber = {};
      let rows = [this.generateDiscussionComponentHeaderRow(columnNames, columnNameToNumber)];
      rows = rows.concat(
        this.generateDiscussionComponentWorkRows(
          this.component,
          columnNames,
          columnNameToNumber,
          this.nodeId
        )
      );
      const fileName = this.generateDiscussionExportFileName(this.nodeId, this.component.id);
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  private generateDiscussionComponentWorkRows(component, columnNames, columnNameToNumber, nodeId) {
    const rows = [];
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
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

  private generateDiscussionComponentWorkRow(
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
    const userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
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
      this.controller.setStudentIDsAndNames(
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
    row[columnNameToNumber['Project ID']] = this.configService.getProjectId();
    row[columnNameToNumber['Project Name']] = this.projectService.getProjectTitle();
    row[columnNameToNumber['Run ID']] = this.configService.getRunId();

    if (componentState.serverSaveTime != null) {
      row[
        columnNameToNumber['Server Timestamp']
      ] = this.utilService.convertMillisecondsToFormattedDateTime(componentState.serverSaveTime);
    }

    if (componentState.clientSaveTime != null) {
      const clientSaveTime = new Date(componentState.clientSaveTime);
      row[columnNameToNumber['Client Timestamp']] =
        clientSaveTime.toDateString() + ' ' + clientSaveTime.toLocaleTimeString();
    }

    row[columnNameToNumber['Node ID']] = nodeId;
    row[columnNameToNumber['Step Title']] = this.projectService.getNodePositionAndTitle(nodeId);
    row[columnNameToNumber['Component Part Number']] =
      this.projectService.getComponentPosition(nodeId, componentId) + 1;
    row[columnNameToNumber['Component ID']] = component.id;
    row[columnNameToNumber['Component Type']] = component.type;
    row[columnNameToNumber['Component Prompt']] = this.utilService.removeHTMLTags(component.prompt);
    row[columnNameToNumber['Student Data']] = componentState.studentData;
    row[columnNameToNumber['Student Work ID']] = componentState.id;
    row[columnNameToNumber['Thread ID']] = threadId;
    row[columnNameToNumber['Workgroup ID']] = workgroupId;
    row[columnNameToNumber['Post Level']] = this.getPostLevel(componentState);
    row[columnNameToNumber['Post Text']] = this.utilService.removeHTMLTags(
      componentState.studentData.response
    );
    return row;
  }

  private getPostLevel(componentState) {
    if (this.isTopLevelPost(componentState)) {
      return 1;
    } else if (this.isReply(componentState)) {
      return 2;
    }
  }

  private isTopLevelPost(componentState) {
    return componentState.studentData.componentStateIdReplyingTo == null;
  }

  private isReply(componentState) {
    return componentState.studentData.componentStateIdReplyingTo != null;
  }

  private getStructuredPosts(componentStates) {
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

  private addReplyToTopLevelPost(structuredPosts, replyComponentState) {
    const parentComponentStateId = replyComponentState.studentData.componentStateIdReplyingTo;
    const parentPost = structuredPosts[parentComponentStateId];
    if (parentPost.replies == null) {
      parentPost.replies = [];
    }
    parentPost.replies.push(replyComponentState);
  }

  private generateDiscussionComponentHeaderRow(columnNames, columnNameToNumber) {
    this.populateDiscussionColumnNames(columnNames, columnNameToNumber);
    const headerRow = [];
    for (let columnName of columnNames) {
      headerRow.push(columnName);
    }
    return headerRow;
  }

  private populateDiscussionColumnNames(columnNames, columnNameToNumber) {
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

  private generateDiscussionExportFileName(nodeId, componentId) {
    const runId = this.configService.getRunId();
    const stepNumber = this.projectService.getNodePositionById(nodeId);
    const componentNumber = this.projectService.getComponentPosition(nodeId, componentId) + 1;
    return runId + '_step_' + stepNumber + '_component_' + componentNumber + '_discussion_work.csv';
  }
}
