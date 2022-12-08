import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { ComponentRevisionCounter } from '../ComponentRevisionCounter';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export abstract class AbstractComponentDataExportStrategy extends AbstractDataExportStrategy {
  canViewStudentNames: boolean;
  includeOnlySubmits: boolean;
  includeStudentNames: boolean;
  workSelectionType: string;

  constructor(
    protected nodeId: string,
    protected component: any,
    additionalParams: ComponentDataExportParams
  ) {
    super();
    this.canViewStudentNames = additionalParams.canViewStudentNames;
    this.includeOnlySubmits = additionalParams.includeOnlySubmits;
    this.includeStudentNames = additionalParams.includeStudentNames;
    this.workSelectionType = additionalParams.workSelectionType;
  }

  abstract generateComponentWorkRow(
    columnNames: string[],
    columnNameToNumber: Map<string, number>,
    rowCounter: number,
    workgroupId: number,
    userId1: number,
    userId2: number,
    userId3: number,
    studentName1: string,
    studentName2: string,
    studentName3: string,
    periodName: string,
    componentRevisionCounter: ComponentRevisionCounter,
    componentState: any
  ): string[];

  generateComponentHeaderRow(
    columnNames: string[],
    columnNameToNumber: Map<string, number>
  ): string[] {
    this.populateColumnNames(columnNames, columnNameToNumber);
    const headerRow = [];
    for (const columnName of columnNames) {
      headerRow.push(columnName);
    }
    return headerRow;
  }

  private populateColumnNames(
    columnNames: string[],
    columnNameToNumber: Map<string, number>
  ): void {
    const defaultColumnNames = [
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
    for (let c = 0; c < defaultColumnNames.length; c++) {
      const defaultColumnName = defaultColumnNames[c];
      columnNameToNumber.set(defaultColumnName, c);
      columnNames.push(defaultColumnName);
    }
  }

  generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: Map<string, number>,
    nodeId: string
  ): string[] {
    const componentId = component.id;
    let rows = [];
    let rowCounter = 1;
    for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
      const rowsForWorkgroup = this.generateComponentWorkRowsForWorkgroup(
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

  private generateComponentWorkRowsForWorkgroup(
    workgroupId: number,
    columnNames: string[],
    columnNameToNumber: Map<string, number>,
    nodeId: string,
    componentId: string,
    rowCounter: number
  ): string[] {
    const rows = [];
    const userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
    const extractedUserIDsAndStudentNames = this.extractUserIDsAndStudentNames(userInfo.users);

    // A mapping from component to component revision counter. The key will be
    // {{nodeId}}_{{componentId}} and the value will be a number.
    const componentRevisionCounter = new ComponentRevisionCounter();
    const componentStates = this.teacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      componentId
    );
    for (let c = 0; c < componentStates.length; c++) {
      const componentState = componentStates[c];
      if (this.shouldExportRow(componentState, c, componentStates.length)) {
        const row = this.generateComponentWorkRow(
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

  /**
   * @param users An array of user objects. Each user object contains an id and name.
   * @returns {object} An object that contains key/value pairs. The key is userIdX
   * or studentNameX where X is an integer. The values are the corresponding actual
   * values of user id and student name.
   */
  private extractUserIDsAndStudentNames(users: any[]): any {
    const extractedUserIDsAndStudentNames = {};
    for (let u = 0; u < users.length; u++) {
      const user = users[u];
      extractedUserIDsAndStudentNames['userId' + (u + 1)] = user.id;
      if (this.canViewStudentNames) {
        extractedUserIDsAndStudentNames['studentName' + (u + 1)] = user.name;
      }
    }
    return extractedUserIDsAndStudentNames;
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

  private incrementRevisionCounter(
    componentRevisionCounter: ComponentRevisionCounter,
    nodeId: string,
    componentId: string
  ): void {
    componentRevisionCounter.incrementCounter(`${nodeId}_${componentId}`);
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
    columnNameToNumber: Map<string, number>,
    rowCounter: number,
    workgroupId: number,
    userId1: number,
    userId2: number,
    userId3: number,
    studentName1: string,
    studentName2: string,
    studentName3: string,
    periodName: string,
    componentRevisionCounter: ComponentRevisionCounter,
    componentState: any
  ): string[] {
    const row = new Array(columnNames.length);
    row.fill('');
    row[columnNameToNumber.get('#')] = rowCounter;
    row[columnNameToNumber.get('Workgroup ID')] = workgroupId;
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
    row[columnNameToNumber.get('Class Period')] = periodName;
    row[columnNameToNumber.get('Project ID')] = this.configService.getProjectId();
    row[columnNameToNumber.get('Project Name')] = this.projectService.getProjectTitle();
    row[columnNameToNumber.get('Run ID')] = this.configService.getRunId();
    row[columnNameToNumber.get('Student Work ID')] = componentState.id;
    if (componentState.serverSaveTime != null) {
      const formattedDateTime = this.utilService.convertMillisecondsToFormattedDateTime(
        componentState.serverSaveTime
      );
      row[columnNameToNumber.get('Server Timestamp')] = formattedDateTime;
    }
    if (componentState.clientSaveTime != null) {
      const clientSaveTime = new Date(componentState.clientSaveTime);
      if (clientSaveTime != null) {
        const clientSaveTimeString =
          clientSaveTime.toDateString() + ' ' + clientSaveTime.toLocaleTimeString();
        row[columnNameToNumber.get('Client Timestamp')] = clientSaveTimeString;
      }
    }
    row[columnNameToNumber.get('Node ID')] = componentState.nodeId;
    row[columnNameToNumber.get('Component ID')] = componentState.componentId;
    row[columnNameToNumber.get('Step Title')] = this.projectService.getNodePositionAndTitle(
      componentState.nodeId
    );
    const componentPartNumber =
      this.projectService.getComponentPosition(componentState.nodeId, componentState.componentId) +
      1;
    row[columnNameToNumber.get('Component Part Number')] = componentPartNumber;
    row[columnNameToNumber.get('Component Type')] = this.component.type;
    if (this.component.prompt != null) {
      let prompt = this.utilService.removeHTMLTags(this.component.prompt);
      prompt = prompt.replace(/"/g, '""');
      row[columnNameToNumber.get('Component Prompt')] = prompt;
    }
    const studentData = componentState.studentData;
    if (studentData != null) {
      row[columnNameToNumber.get('Student Data')] = studentData;
      const isCorrect = studentData.isCorrect;
      if (isCorrect != null) {
        if (isCorrect) {
          row[columnNameToNumber.get('Is Correct')] = 1;
        } else {
          row[columnNameToNumber.get('Is Correct')] = 0;
        }
      }
    }
    const revisionCounter = this.getRevisionCounter(
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
      row[columnNameToNumber.get('Component Revision Counter')] = revisionCounter;
    } else {
      /*
       * use the revision counter from the value in the component state.
       * this case will happen when we are exporting latest student work
       * because the revision counter needs to be previously calculated
       * and then set into the component state
       */
      row[columnNameToNumber.get('Component Revision Counter')] = componentState.revisionCounter;
    }
    this.incrementRevisionCounter(
      componentRevisionCounter,
      componentState.nodeId,
      componentState.componentId
    );
    const isSubmit = componentState.isSubmit;
    if (isSubmit) {
      row[columnNameToNumber.get('Is Submit')] = 1;
      if (studentData != null) {
        const submitCounter = studentData.submitCounter;
        if (submitCounter != null) {
          row[columnNameToNumber.get('Submit Count')] = submitCounter;
        }
      }
    } else {
      row[columnNameToNumber.get('Is Submit')] = 0;
    }
    return row;
  }

  private setStudentIDsAndNames(
    row: any[],
    columnNameToNumber: Map<string, number>,
    userId1: number,
    studentName1: string,
    userId2: number,
    studentName2: string,
    userId3: number,
    studentName3: string
  ): void {
    if (userId1 != null) {
      row[columnNameToNumber.get('User ID 1')] = userId1;
    }
    if (studentName1 != null && this.includeStudentNames) {
      row[columnNameToNumber.get('Student Name 1')] = studentName1;
    }
    if (userId2 != null) {
      row[columnNameToNumber.get('User ID 2')] = userId2;
    }
    if (studentName2 != null && this.includeStudentNames) {
      row[columnNameToNumber.get('Student Name 2')] = studentName2;
    }
    if (userId3 != null) {
      row[columnNameToNumber.get('User ID 3')] = userId3;
    }
    if (studentName3 != null && this.includeStudentNames) {
      row[columnNameToNumber.get('Student Name 3')] = studentName3;
    }
  }

  /**
   * Get the revision number for the next component state revision.
   * @param componentRevisionCounter The mapping from component to revision
   * counter.
   * @param nodeId The node id the component is in.
   * @param componentId The component id of the component.
   */
  private getRevisionCounter(
    componentRevisionCounter: ComponentRevisionCounter,
    nodeId: string,
    componentId: string
  ): number {
    const nodeIdAndComponentId = `${nodeId}_${componentId}`;
    if (!componentRevisionCounter.has(nodeIdAndComponentId)) {
      componentRevisionCounter.set(nodeIdAndComponentId, 1);
    }
    return componentRevisionCounter.get(nodeIdAndComponentId);
  }

  generateExportFileName(nodeId: string, componentId: string, componentType: string): string {
    const runId = this.configService.getRunId();
    const stepNumber = this.projectService.getNodePositionById(nodeId);
    const componentNumber = this.projectService.getComponentPosition(nodeId, componentId) + 1;
    return `${runId}_step_${stepNumber}_component_${componentNumber}_${componentType}_work.csv`;
  }
}
