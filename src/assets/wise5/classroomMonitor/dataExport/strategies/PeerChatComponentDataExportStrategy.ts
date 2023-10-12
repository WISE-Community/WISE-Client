import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export class PeerChatComponentDataExportStrategy extends AbstractDataExportStrategy {
  defaultColumnNames = [
    '#',
    'Peer Group ID',
    'Workgroup ID',
    'User ID 1',
    'Student Name 1',
    'User ID 2',
    'Student Name 2',
    'User ID 3',
    'Student Name 3',
    'Class Period',
    'Project ID',
    'Unit Name',
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
    'Response'
  ];

  constructor(private nodeId: string, private component: any) {
    super();
  }

  export(): void {
    this.controller.showDownloadingExportMessage();
    const components = [{ nodeId: this.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentData(components, true, false, true).subscribe(() => {
      const columnNameToNumber = {};
      const headerRow = this.generateComponentHeaderRow(this.component, columnNameToNumber);
      let rows = [headerRow];
      rows = rows.concat(
        this.generateComponentWorkRows(this.component, headerRow, columnNameToNumber, this.nodeId)
      );
      const fileName = this.generateExportFileName(this.nodeId, this.component.id);
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  private generateComponentHeaderRow(component: any, columnNameToNumber: any): string[] {
    const headerRow = this.defaultColumnNames.map((columnName: string) => columnName);
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    this.insertDynamicPromptColumnIfNecessary(headerRow, componentStates);
    this.insertQuestionColumnsIfNecessary(headerRow, componentStates);
    this.populateColumnNameMappings(headerRow, columnNameToNumber);
    return headerRow;
  }

  private insertDynamicPromptColumnIfNecessary(headerRow: string[], componentStates: any[]): void {
    if (this.hasDynamicPrompt(componentStates)) {
      headerRow.splice(headerRow.indexOf('Response'), 0, 'Dynamic Prompt');
    }
  }

  private hasDynamicPrompt(componentStates: any[]): boolean {
    return componentStates.some(
      (componentState: any) => componentState.studentData.dynamicPrompt?.prompt != null
    );
  }

  private insertQuestionColumnsIfNecessary(headerRow: string[], componentStates: any[]): void {
    const maxQuestions = this.getMaxQuestionBankCount(componentStates);
    if (maxQuestions > 0) {
      for (let q = 0; q < maxQuestions; q++) {
        headerRow.splice(headerRow.indexOf('Response'), 0, `Question ${q + 1}`);
      }
    }
  }

  private getMaxQuestionBankCount(componentStates: any[]): number {
    let maxQuestionBankCount = 0;
    for (const componentState of componentStates) {
      const questionBankCount = this.getQuestionBankCount(componentState);
      if (questionBankCount > maxQuestionBankCount) {
        maxQuestionBankCount = questionBankCount;
      }
    }
    return maxQuestionBankCount;
  }

  private getQuestionBankCount(componentState: any): number {
    let questionCount = 0;
    if (componentState.studentData.questionBank != null) {
      for (const questionBank of componentState.studentData.questionBank) {
        questionCount += questionBank.questions.length;
      }
    }
    return questionCount;
  }

  private populateColumnNameMappings(columnNames: string[], columnNameToNumber: any): void {
    for (let c = 0; c < columnNames.length; c++) {
      columnNameToNumber[columnNames[c]] = c;
    }
  }

  private generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): any[] {
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    const sortedComponentStates = this.sortByPeerGroupIdAndTimestamp(componentStates);
    const workRows = [];
    for (let r = 0; r < sortedComponentStates.length; r++) {
      const componentState = sortedComponentStates[r];
      const row = new Array(columnNames.length);
      this.setColumnValue(row, columnNameToNumber, '#', r + 1);
      this.setStudentInfo(row, columnNameToNumber, componentState);
      this.setRunInfo(row, columnNameToNumber, componentState);
      this.setComponentInfo(row, columnNameToNumber, nodeId, component);
      this.setStudentWork(row, columnNameToNumber, componentState);
      workRows.push(row);
    }
    return workRows;
  }

  private sortByPeerGroupIdAndTimestamp(componentStates: any[]): any[] {
    return componentStates.sort((a, b) => {
      if (a.peerGroupId < b.peerGroupId) {
        return -1;
      } else if (a.peerGroupId > b.peerGroupId) {
        return 1;
      } else {
        return a.serverSaveTime - b.serverSaveTime;
      }
    });
  }

  private setStudentInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    this.setColumnValue(row, columnNameToNumber, 'Peer Group ID', componentState.peerGroupId);
    this.setColumnValue(row, columnNameToNumber, 'Workgroup ID', componentState.workgroupId);
    const userInfo = this.configService.getUserInfoByWorkgroupId(componentState.workgroupId);
    if (userInfo != null) {
      for (let u = 0; u < userInfo.users.length; u++) {
        const user = userInfo.users[u];
        this.setColumnValue(row, columnNameToNumber, `User ID ${u + 1}`, user.id);
        this.setColumnValue(row, columnNameToNumber, `Student Name ${u + 1}`, user.name);
      }
    }
  }

  private setRunInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    const userInfo = this.configService.getUserInfoByWorkgroupId(componentState.workgroupId);
    if (userInfo != null) {
      this.setColumnValue(row, columnNameToNumber, 'Class Period', userInfo.periodName);
    }
    this.setColumnValue(row, columnNameToNumber, 'Project ID', this.configService.getProjectId());
    this.setColumnValue(row, columnNameToNumber, 'Unit Name', this.configService.getRunName());
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

  private setComponentInfo(
    row: any[],
    columnNameToNumber: any,
    nodeId: string,
    component: any
  ): void {
    this.setColumnValue(row, columnNameToNumber, 'Node ID', nodeId);
    this.setColumnValue(row, columnNameToNumber, 'Component ID', component.id);
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Component Part Number',
      this.projectService.getComponentPosition(nodeId, component.id) + 1
    );
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Step Title',
      this.projectService.getNodePositionAndTitle(nodeId)
    );
    this.setColumnValue(row, columnNameToNumber, 'Component Type', component.type);
    this.setColumnValue(row, columnNameToNumber, 'Component Prompt', component.prompt);
  }

  private setStudentWork(row: any[], columnNameToNumber: any, componentState: any): void {
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Server Timestamp',
      millisecondsToDateTime(componentState.serverSaveTime)
    );
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Client Timestamp',
      millisecondsToDateTime(componentState.clientSaveTime)
    );
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Dynamic Prompt',
      componentState.studentData.dynamicPrompt?.prompt
    );
    if (componentState.studentData.questionBank != null) {
      this.setQuestions(row, columnNameToNumber, componentState);
    }
    this.setColumnValue(row, columnNameToNumber, 'Response', componentState.studentData.response);
  }

  private setQuestions(row: any[], columnNameToNumber: any, componentState: any): void {
    let questionCounter = 1;
    for (const questionBank of componentState.studentData.questionBank) {
      for (const question of questionBank.questions) {
        this.setColumnValue(
          row,
          columnNameToNumber,
          `Question ${questionCounter++}`,
          question.text
        );
      }
    }
  }

  private setColumnValue(
    row: any[],
    columnNameToNumber: any,
    columnName: string,
    value: any
  ): void {
    row[columnNameToNumber[columnName]] = value;
  }

  private generateExportFileName(nodeId: string, componentId: string): string {
    const runId = this.configService.getRunId();
    const stepNumber = this.projectService.getNodePositionById(nodeId);
    const componentNumber = this.projectService.getComponentPosition(nodeId, componentId) + 1;
    return `${runId}_step_${stepNumber}_component_${componentNumber}_peer_chat_work.csv`;
  }
}
