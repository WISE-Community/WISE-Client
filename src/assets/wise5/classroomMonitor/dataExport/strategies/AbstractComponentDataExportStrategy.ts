import { ComponentState } from '../../../../../app/domain/componentState';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { removeHTMLTags } from '../../../common/string/string';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export abstract class AbstractComponentDataExportStrategy extends AbstractDataExportStrategy {
  protected allOrLatest: 'all' | 'latest';
  protected componentStateIdToRevisionNumber = {};
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
  protected includeOnlySubmits: boolean;
  protected includeStudentNames: boolean;
  protected revisionCounter: any = {};

  constructor(
    protected nodeId: string,
    protected component: any,
    additionalParams: ComponentDataExportParams
  ) {
    super();
    this.includeOnlySubmits = additionalParams.includeOnlySubmits;
    this.includeStudentNames = additionalParams.includeStudentNames;
  }

  export(): void {
    const components = [{ nodeId: this.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentData(components, true, false, true).subscribe(() => {
      const columnNameToNumber = {};
      const headerRow = this.generateComponentHeaderRow(this.component);
      this.populateColumnNameMappings(headerRow, columnNameToNumber);
      let rows = [headerRow];
      rows = rows.concat(
        this.generateComponentWorkRows(this.component, headerRow, columnNameToNumber, this.nodeId)
      );
      const fileName = super.generateExportFileName(
        this.nodeId,
        this.component.id,
        this.getComponentTypeWithUnderscore()
      );
      this.generateCSVFile(rows, fileName);
    });
  }

  protected abstract generateComponentHeaderRow(component: any): string[];

  protected abstract generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[];

  protected setStudentInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    this.setColumnValue(row, columnNameToNumber, 'Workgroup ID', componentState.workgroupId);
    const userInfo = this.configService.getUserInfoByWorkgroupId(componentState.workgroupId);
    if (userInfo != null) {
      for (let u = 0; u < userInfo.users.length; u++) {
        const user = userInfo.users[u];
        this.setColumnValue(row, columnNameToNumber, `User ID ${u + 1}`, user.id);
        this.setColumnValue(
          row,
          columnNameToNumber,
          `Student Name ${u + 1}`,
          this.includeStudentNames ? user.name : ''
        );
      }
    }
  }

  protected abstract getComponentTypeWithUnderscore(): string;

  protected getComponentStates(component: any): ComponentState[] {
    let componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    this.sortByWorkgroupIdAndTimestamp(componentStates);
    this.calculateRevisionNumbers(componentStates);
    if (this.allOrLatest === 'latest') {
      componentStates = this.getLatestRevisions(componentStates);
    }
    if (this.includeOnlySubmits) {
      componentStates = componentStates.filter((componentState: any) => componentState.isSubmit);
    }
    return componentStates;
  }

  private sortByWorkgroupIdAndTimestamp(componentStates: any[]): any[] {
    return componentStates.sort((a: any, b: any) => {
      return a.workgroupId == b.workgroupId
        ? a.serverSaveTime - b.serverSaveTime
        : a.workgroupId - b.workgroupId;
    });
  }

  private calculateRevisionNumbers(componentStates: any[]): void {
    for (const componentState of componentStates) {
      const workgroupId = componentState.workgroupId;
      const nodeId = componentState.nodeId;
      const componentId = componentState.componentId;
      this.incrementRevisionCounter(workgroupId, nodeId, componentId);
      this.componentStateIdToRevisionNumber[componentState.id] = this.getRevisionCounter(
        workgroupId,
        nodeId,
        componentId
      );
    }
  }

  protected incrementRevisionCounter(
    workgroupId: number,
    nodeId: string,
    componentId: string
  ): void {
    const key = this.getRevisionCounterKey(workgroupId, nodeId, componentId);
    if (this.revisionCounter[key] == null) {
      this.revisionCounter[key] = 1;
    } else {
      this.revisionCounter[key]++;
    }
  }

  protected getRevisionCounterKey(
    workgroupId: number,
    nodeId: string,
    componentId: string
  ): string {
    return `${workgroupId}-${nodeId}-${componentId}`;
  }

  private getRevisionCounter(workgroupId: number, nodeId: string, componentId: string): number {
    return this.revisionCounter[this.getRevisionCounterKey(workgroupId, nodeId, componentId)];
  }

  protected getLatestRevisions(componentStates: ComponentState[]): ComponentState[] {
    const latestRevisions = [];
    const workgroupIdsFound = {};
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (workgroupIdsFound[componentState.workgroupId] == null) {
        latestRevisions.unshift(componentState);
        workgroupIdsFound[componentState.workgroupId] = true;
      }
    }
    return latestRevisions;
  }

  protected setComponentInfo(
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
      this.projectService.getNode(nodeId).getComponentPosition(component.id) + 1
    );
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Step Title',
      this.projectService.getNodePositionAndTitle(nodeId)
    );
    this.setColumnValue(row, columnNameToNumber, 'Component Type', component.type);
    this.setColumnValue(row, columnNameToNumber, 'Component Prompt', this.getPrompt(component));
  }

  private getPrompt(component: any): string {
    return removeHTMLTags(component.prompt).replace(/"/g, '""');
  }

  protected setStudentWork(
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
    this.setColumnValue(row, columnNameToNumber, 'Student Work ID', componentState.id);
    this.setColumnValue(row, columnNameToNumber, 'Student Data', componentState.studentData);
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Component Revision Counter',
      this.componentStateIdToRevisionNumber[componentState.id]
    );
    this.setColumnValue(row, columnNameToNumber, 'Is Submit', componentState.isSubmit ? 1 : 0);
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Submit Count',
      componentState.studentData.submitCounter ? componentState.studentData.submitCounter : 0
    );
  }
}
