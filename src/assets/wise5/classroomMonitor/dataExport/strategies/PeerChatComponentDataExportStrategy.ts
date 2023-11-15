import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { ComponentDataExportStrategy } from './ComponentDataExportStrategy';

export class PeerChatComponentDataExportStrategy extends ComponentDataExportStrategy {
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
    'Response'
  ];

  protected generateComponentHeaderRow(component: any, columnNameToNumber: any): string[] {
    const headerRow = [...this.defaultColumnNames];
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    this.insertPromptColumns(headerRow, component);
    this.insertQuestionColumns(headerRow, component, componentStates);
    this.populateColumnNameMappings(headerRow, columnNameToNumber);
    return headerRow;
  }

  private insertPromptColumns(headerRow: string[], component: any): void {
    if (!this.hasDynamicPrompt(component)) {
      this.insertColumnBeforeResponseColumn(headerRow, 'Prompt');
    }
    if (this.hasPrePrompt(component)) {
      this.insertColumnBeforeResponseColumn(headerRow, 'Pre Prompt');
    }
    if (this.hasDynamicPrompt(component)) {
      this.insertColumnBeforeResponseColumn(headerRow, 'Dynamic Prompt');
    }
    if (this.hasPostPrompt(component)) {
      this.insertColumnBeforeResponseColumn(headerRow, 'Post Prompt');
    }
  }

  private insertQuestionColumns(headerRow: string[], component: any, componentStates: any[]): void {
    const maxQuestions = this.getMaxQuestionBankCount(componentStates);
    if (maxQuestions > 0) {
      for (let q = 0; q < maxQuestions; q++) {
        this.insertColumnBeforeResponseColumn(headerRow, `Question ${q + 1}`);
      }
    }
    if (this.isClickToUseEnabled(component)) {
      this.insertColumnBeforeResponseColumn(headerRow, 'Question Used');
    }
  }

  private hasPrePrompt(component: any): boolean {
    return this.hasDynamicPrompt(component) && this.hasValue(component.dynamicPrompt?.prePrompt);
  }

  private hasDynamicPrompt(component: any): boolean {
    return component.dynamicPrompt?.enabled;
  }

  private hasPostPrompt(component: any): boolean {
    return this.hasDynamicPrompt(component) && this.hasValue(component.dynamicPrompt?.postPrompt);
  }

  private hasValue(value: any): boolean {
    return value != null && value !== '';
  }

  private isClickToUseEnabled(component: any): boolean {
    return component.questionBank?.clickToUseEnabled;
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

  protected generateComponentWorkRows(
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
      const row = new Array(columnNames.length).fill('');
      this.setColumnValue(row, columnNameToNumber, '#', r + 1);
      this.setStudentInfo(row, columnNameToNumber, componentState);
      this.setRunInfo(row, columnNameToNumber, componentState);
      this.setComponentInfo(row, columnNameToNumber, nodeId, component);
      this.setStudentWork(row, columnNameToNumber, component, componentState);
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

  protected setStudentInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    this.setColumnValue(row, columnNameToNumber, 'Peer Group ID', componentState.peerGroupId);
    super.setStudentInfo(row, columnNameToNumber, componentState);
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
    if (!this.hasDynamicPrompt(component)) {
      this.setColumnValue(row, columnNameToNumber, 'Prompt', component.prompt);
    }
  }

  private setStudentWork(
    row: any[],
    columnNameToNumber: any,
    component: any,
    componentState: any
  ): void {
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
    this.setDynamicPrompts(row, columnNameToNumber, component, componentState);
    if (componentState.studentData.questionBank != null) {
      this.setQuestions(row, columnNameToNumber, componentState);
    }
    if (this.isClickToUseEnabled(component)) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        'Question Used',
        this.getQuestionText(component, componentState.studentData.questionId)
      );
    }
    this.setColumnValue(row, columnNameToNumber, 'Response', componentState.studentData.response);
  }

  private setDynamicPrompts(
    row: any,
    columnNameToNumber: any,
    component: any,
    componentState: any
  ): void {
    if (this.hasPrePrompt(component)) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        'Pre Prompt',
        component.dynamicPrompt?.prePrompt
      );
    }
    if (this.hasDynamicPrompt(component)) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        'Dynamic Prompt',
        componentState.studentData.dynamicPrompt?.prompt
      );
    }
    if (this.hasPostPrompt(component)) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        'Post Prompt',
        component.dynamicPrompt?.postPrompt
      );
    }
  }

  private setQuestions(row: any[], columnNameToNumber: any, componentState: any): void {
    let questionCounter = 1;
    for (const questionBank of componentState.studentData.questionBank) {
      for (const question of questionBank.questions) {
        this.setColumnValue(
          row,
          columnNameToNumber,
          `Question ${questionCounter++}`,
          typeof question === 'string' ? question : question.text
        );
      }
    }
  }

  private getQuestionText(component: any, questionId: string): string {
    for (const rule of component.questionBank.rules) {
      for (const question of rule.questions) {
        if (question.id === questionId) {
          return question.text;
        }
      }
    }
    return null;
  }

  protected getComponentTypeWithUnderscore(): string {
    return 'peer_chat';
  }
}
