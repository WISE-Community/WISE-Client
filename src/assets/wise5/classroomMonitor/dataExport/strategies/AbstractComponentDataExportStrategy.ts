import { Component } from '../../../common/Component';
import { removeHTMLTags } from '../../../common/string/string';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { ComponentRevisionCounter } from '../ComponentRevisionCounter';
import { UserIdsAndStudentNames } from '../UserIdsAndStudentNames';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';

export abstract class AbstractComponentDataExportStrategy extends AbstractDataExportStrategy {
  abstract COMPONENT_TYPE: string;

  canViewStudentNames: boolean;
  columnNames: string[] = [
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
    'Component Revision Counter',
    'Is Submit',
    'Submit Count'
  ];
  columnNameToNumber: Map<string, number> = new Map<string, number>();
  includeOnlySubmits: boolean;
  includeStudentNames: boolean;
  rowCounter: number;
  workSelectionType: string;

  constructor(protected component: Component, additionalParams: ComponentDataExportParams) {
    super();
    this.canViewStudentNames = additionalParams.canViewStudentNames;
    this.includeOnlySubmits = additionalParams.includeOnlySubmits;
    this.includeStudentNames = additionalParams.includeStudentNames;
    this.workSelectionType = additionalParams.workSelectionType;
  }

  abstract generateComponentWorkRow(
    workgroupId: number,
    userIdsAndStudentNames: UserIdsAndStudentNames,
    periodName: string,
    componentRevisionCounter: ComponentRevisionCounter,
    componentState: any
  ): string[];

  generateComponentHeaderRow(columnNames: string[]): string[] {
    return [...columnNames];
  }

  populateColumnNames(): void {
    for (let c = 0; c < this.columnNames.length; c++) {
      this.columnNameToNumber.set(this.columnNames[c], c);
    }
  }

  generateComponentWorkRows(component: Component): string[] {
    let rows = [];
    this.rowCounter = 1;
    for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
      const rowsForWorkgroup = this.generateComponentWorkRowsForWorkgroup(workgroupId, component);
      rows = rows.concat(rowsForWorkgroup);
    }
    return rows;
  }

  private generateComponentWorkRowsForWorkgroup(
    workgroupId: number,
    component: Component
  ): string[] {
    const rows = [];
    const userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
    const userIdsAndStudentNames = new UserIdsAndStudentNames(
      userInfo.users,
      this.canViewStudentNames
    );
    const componentRevisionCounter = new ComponentRevisionCounter();
    const componentStates = this.teacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      component.id
    );
    for (let c = 0; c < componentStates.length; c++) {
      const componentState = componentStates[c];
      if (this.shouldExportRow(componentState, c, componentStates.length)) {
        const row = this.generateComponentWorkRow(
          workgroupId,
          userIdsAndStudentNames,
          userInfo.periodName,
          componentRevisionCounter,
          componentState
        );
        rows.push(row);
        this.rowCounter++;
      } else {
        componentRevisionCounter.incrementCounter(component.nodeId, component.id);
      }
    }
    return rows;
  }

  private shouldExportRow(
    componentState: any,
    componentStateIndex: number,
    numComponentStates: number
  ): boolean {
    return !(
      this.includeOnlySubmitsAndIsNotSubmit(componentState) ||
      this.exportLatestWorkAndIsNotLatestWork(componentStateIndex, numComponentStates)
    );
  }

  private includeOnlySubmitsAndIsNotSubmit(componentState: any): boolean {
    return this.includeOnlySubmits && !componentState.isSubmit;
  }

  private exportLatestWorkAndIsNotLatestWork(
    componentStateIndex: number,
    numComponentStates: number
  ): boolean {
    return (
      this.workSelectionType === 'exportLatestWork' &&
      componentStateIndex !== numComponentStates - 1
    );
  }

  /**
   * Create the array that will be used as a row in the student work export
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
    workgroupId: number,
    userIdsAndStudentNames: UserIdsAndStudentNames,
    periodName: string,
    componentRevisionCounter: ComponentRevisionCounter,
    componentState: any
  ): string[] {
    const row = new Array(this.columnNames.length);
    row.fill('');
    row[this.columnNameToNumber.get('#')] = this.rowCounter;
    row[this.columnNameToNumber.get('Workgroup ID')] = workgroupId;
    this.setStudentIDsAndNames(row, userIdsAndStudentNames);
    row[this.columnNameToNumber.get('Class Period')] = periodName;
    row[this.columnNameToNumber.get('Project ID')] = this.configService.getProjectId();
    row[this.columnNameToNumber.get('Project Name')] = this.projectService.getProjectTitle();
    row[this.columnNameToNumber.get('Run ID')] = this.configService.getRunId();
    row[this.columnNameToNumber.get('Student Work ID')] = componentState.id;
    row[this.columnNameToNumber.get('Server Timestamp')] = millisecondsToDateTime(
      componentState.serverSaveTime
    );
    const clientSaveTime = new Date(componentState.clientSaveTime);
    const clientSaveTimeString =
      clientSaveTime.toDateString() + ' ' + clientSaveTime.toLocaleTimeString();
    row[this.columnNameToNumber.get('Client Timestamp')] = clientSaveTimeString;
    row[this.columnNameToNumber.get('Node ID')] = componentState.nodeId;
    row[this.columnNameToNumber.get('Component ID')] = componentState.componentId;
    row[this.columnNameToNumber.get('Step Title')] = this.projectService.getNodePositionAndTitle(
      componentState.nodeId
    );
    const componentPartNumber =
      this.projectService.getComponentPosition(componentState.nodeId, componentState.componentId) +
      1;
    row[this.columnNameToNumber.get('Component Part Number')] = componentPartNumber;
    row[this.columnNameToNumber.get('Component Type')] = this.component.content.type;
    if (this.component.content.prompt != null) {
      let prompt = removeHTMLTags(this.component.content.prompt);
      prompt = prompt.replace(/"/g, '""');
      row[this.columnNameToNumber.get('Component Prompt')] = prompt;
    }
    const studentData = componentState.studentData;
    row[this.columnNameToNumber.get('Student Data')] = studentData;
    const isCorrect = studentData.isCorrect;
    if (isCorrect != null) {
      row[this.columnNameToNumber.get('Is Correct')] = isCorrect ? 1 : 0;
    }
    if (componentState.revisionCounter == null) {
      /*
       * use the revision counter obtained from the componentRevisionCounter
       * mapping. this case will happen when we are exporting all student
       * work.
       */
      row[
        this.columnNameToNumber.get('Component Revision Counter')
      ] = componentRevisionCounter.getCounter(componentState.nodeId, componentState.componentId);
    } else {
      /*
       * use the revision counter from the value in the component state.
       * this case will happen when we are exporting latest student work
       * because the revision counter needs to be previously calculated
       * and then set into the component state
       */
      row[this.columnNameToNumber.get('Component Revision Counter')] =
        componentState.revisionCounter;
    }
    componentRevisionCounter.incrementCounter(componentState.nodeId, componentState.componentId);
    if (componentState.isSubmit) {
      row[this.columnNameToNumber.get('Is Submit')] = 1;
      const submitCounter = studentData.submitCounter;
      if (submitCounter != null) {
        row[this.columnNameToNumber.get('Submit Count')] = submitCounter;
      }
    } else {
      row[this.columnNameToNumber.get('Is Submit')] = 0;
    }
    return row;
  }

  private setStudentIDsAndNames(row: any[], userIdsAndStudentNames: UserIdsAndStudentNames): void {
    for (let s = 1; s <= 3; s++) {
      this.setUserIdIfAvailable(row, userIdsAndStudentNames, s);
      this.setStudentNameIfAvailable(row, userIdsAndStudentNames, s);
    }
  }

  private setUserIdIfAvailable(
    row: any[],
    userIdsAndStudentNames: UserIdsAndStudentNames,
    studentNumber: number
  ): void {
    const userId = userIdsAndStudentNames.getUserId(studentNumber);
    if (userId != null) {
      row[this.columnNameToNumber.get(`User ID ${studentNumber}`)] = userId;
    }
  }

  private setStudentNameIfAvailable(
    row: any[],
    userIdsAndStudentNames: UserIdsAndStudentNames,
    studentNumber: number
  ): void {
    const studentName = userIdsAndStudentNames.getStudentName(studentNumber);
    if (studentName != null && this.includeStudentNames) {
      row[this.columnNameToNumber.get(`Student Name ${studentNumber}`)] = studentName;
    }
  }

  generateExportFileName(): string {
    const runId = this.configService.getRunId();
    const stepNumber = this.projectService.getNodePositionById(this.component.nodeId);
    const componentNumber =
      this.projectService.getComponentPosition(this.component.nodeId, this.component.id) + 1;
    return `${runId}_step_${stepNumber}_component_${componentNumber}_${this.COMPONENT_TYPE}_work.csv`;
  }
}
