import { removeHTMLTags } from '../../../common/string/string';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class DiscussionComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  protected defaultColumnNames = [
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

  protected generateComponentHeaderRow(component: any, columnNameToNumber: any): string[] {
    return [...this.defaultColumnNames];
  }

  protected generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ) {
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
    if (componentState.serverSaveTime != null) {
      row[columnNameToNumber['Server Timestamp']] = millisecondsToDateTime(
        componentState.serverSaveTime
      );
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
    row[columnNameToNumber['Component Prompt']] = removeHTMLTags(component.prompt);
    row[columnNameToNumber['Student Data']] = componentState.studentData;
    row[columnNameToNumber['Student Work ID']] = componentState.id;
    row[columnNameToNumber['Thread ID']] = Number(threadId);
    row[columnNameToNumber['Workgroup ID']] = workgroupId;
    row[columnNameToNumber['Post Level']] = this.getPostLevel(componentState);
    row[columnNameToNumber['Post Text']] = removeHTMLTags(componentState.studentData.response);
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

  protected getComponentTypeWithUnderscore(): string {
    return 'discussion';
  }
}
