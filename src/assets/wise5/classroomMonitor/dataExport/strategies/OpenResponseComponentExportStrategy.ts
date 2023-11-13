import { ComponentState } from '../../../../../app/domain/componentState';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { ComponentDataExportStrategy } from './ComponentExportStrategy';

export class OpenResponseComponentDataExportStrategy extends ComponentDataExportStrategy {
  autoScoreLabel: string = 'Auto Score';
  defaultColumnNames = [
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
    'Submit Count',
    'Item ID',
    'Response'
  ];
  ideaLabel: string = 'Idea';
  revisionCounter: any = {};
  scoreLabel: string = 'Score';

  constructor(
    protected nodeId: string,
    protected component: any,
    protected allOrLatest: 'all' | 'latest'
  ) {
    super(nodeId, component);
  }

  protected generateComponentHeaderRow(component: any, columnNameToNumber: any): string[] {
    const headerRow = [...this.defaultColumnNames];
    if (this.isCRaterEnabled(component)) {
      const annotations = this.annotationService.getAnnotationsByNodeIdComponentId(
        this.nodeId,
        component.id
      );
      this.tryToAddIdeaColumnNames(headerRow, annotations);
      this.tryToAddScoreColumnNames(headerRow, annotations);
    }
    this.populateColumnNameMappings(headerRow, columnNameToNumber);
    return headerRow;
  }

  private isCRaterEnabled(component: any): boolean {
    return component.enableCRater && component.cRater.itemId !== '';
  }

  private tryToAddIdeaColumnNames(columnNames: string[], annotations: any[]): void {
    const ideaNames = this.getIdeaNamesFromAnnotations(annotations);
    for (const ideaName of ideaNames) {
      columnNames.push(`${this.ideaLabel} ${ideaName}`);
    }
  }

  private getIdeaNamesFromAnnotations(annotations: any[]): string[] {
    const ideaNames = new Set();
    for (const annotation of annotations) {
      const ideaNamesFromAnnotation = this.getIdeaNamesFromAnnotation(annotation);
      for (const ideaName of ideaNamesFromAnnotation) {
        ideaNames.add(ideaName);
      }
    }
    return Array.from(ideaNames).sort(this.sortIdeaNames) as string[];
  }

  private sortIdeaNames(a: any, b: any): number {
    const aInt = parseInt(a);
    const bInt = parseInt(b);
    // if a and b are the same number but one of them contains a letter, we will sort alphabetically
    // when a string like "5a" is given to parseInt(), it will return 5 therefore if we are
    // comparing "5" and "5a" we will sort alphabetically because we want 5 to show up before 5a
    if (!isNaN(aInt) && !isNaN(bInt) && aInt !== bInt) {
      // sort numerically
      return aInt - bInt;
    } else {
      // sort alphabetically
      return a.localeCompare(b);
    }
  }

  private getIdeaNamesFromAnnotation(annotation: any): string[] {
    const ideaNames = [];
    if (annotation.data.ideas != null) {
      for (const idea of annotation.data.ideas) {
        ideaNames.push(idea.name);
      }
    }
    return ideaNames;
  }

  private tryToAddScoreColumnNames(columnNames: string[], annotations: any[]): void {
    const scoreNames = this.getScoreNamesFromAnnotations(annotations);
    if (scoreNames.length === 0) {
      this.insertColumnAtEnd(columnNames, this.autoScoreLabel);
    } else {
      for (const scoreName of scoreNames) {
        this.insertColumnAtEnd(columnNames, `${this.scoreLabel} ${scoreName}`);
      }
    }
  }

  private getScoreNamesFromAnnotations(annotations: any[]): string[] {
    const scoreNames = new Set();
    for (const annotation of annotations) {
      const scoreNamesFromAnnotation = this.getScoreNamesFromAnnotation(annotation);
      for (const scoreName of scoreNamesFromAnnotation) {
        scoreNames.add(scoreName);
      }
    }
    return Array.from(scoreNames).sort() as string[];
  }

  private getScoreNamesFromAnnotation(annotation: any): string[] {
    const scoreNames = [];
    if (annotation.data.scores != null) {
      for (const score of annotation.data.scores) {
        scoreNames.push(score.id);
      }
    }
    return scoreNames.sort();
  }

  protected generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): any[] {
    let componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    this.sortByWorkgroupIdAndTimestamp(componentStates);
    if (this.allOrLatest === 'latest') {
      componentStates = this.getLatestRevisions(componentStates);
    }
    const workRows = [];
    for (let r = 0; r < componentStates.length; r++) {
      const componentState = componentStates[r];
      const row = new Array(columnNames.length).fill('');
      this.setColumnValue(row, columnNameToNumber, '#', r + 1);
      this.setStudentInfo(row, columnNameToNumber, componentState);
      this.setRunInfo(row, columnNameToNumber, componentState);
      this.setComponentInfo(row, columnNameToNumber, nodeId, component);
      this.setStudentWork(row, columnNameToNumber, componentState);
      workRows.push(row);
    }
    return workRows;
  }

  private getLatestRevisions(componentStates: ComponentState[]): ComponentState[] {
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

  private sortByWorkgroupIdAndTimestamp(componentStates: any[]): any[] {
    return componentStates.sort((a: any, b: any) => {
      return a.workgroupId == b.workgroupId
        ? a.serverSaveTime - b.serverSaveTime
        : a.workgroupId - b.workgroupId;
    });
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
    this.setColumnValue(row, columnNameToNumber, 'Item ID', component.cRater.itemId);
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
    this.setColumnValue(row, columnNameToNumber, 'Student Work ID', componentState.id);
    this.setColumnValue(row, columnNameToNumber, 'Student Data', componentState.studentData);
    this.setColumnValue(row, columnNameToNumber, 'Response', componentState.studentData.response);
    this.incrementRevisionCounter(
      componentState.workgroupId,
      componentState.nodeId,
      componentState.componentId
    );
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Component Revision Counter',
      this.getRevisionCounter(
        componentState.workgroupId,
        componentState.nodeId,
        componentState.componentId
      )
    );
    this.setColumnValue(row, columnNameToNumber, 'Is Submit', componentState.isSubmit ? 1 : 0);
    this.setColumnValue(
      row,
      columnNameToNumber,
      'Submit Count',
      componentState.studentData.submitCounter ? componentState.studentData.submitCounter : 0
    );
    this.setAnnotationData(row, columnNameToNumber, componentState);
  }

  private getRevisionCounter(workgroupId: number, nodeId: string, componentId: string): number {
    return this.revisionCounter[this.getRevisionCounterKey(workgroupId, nodeId, componentId)];
  }

  private incrementRevisionCounter(workgroupId: number, nodeId: string, componentId: string): void {
    const key = this.getRevisionCounterKey(workgroupId, nodeId, componentId);
    if (this.revisionCounter[key] == null) {
      this.revisionCounter[key] = 1;
    } else {
      this.revisionCounter[key]++;
    }
  }

  private getRevisionCounterKey(workgroupId: number, nodeId: string, componentId: string): string {
    return `${workgroupId}-${nodeId}-${componentId}`;
  }

  private setAnnotationData(row: any[], columnNameToNumber: any, componentState: any): void {
    const annotation = this.annotationService.getLatestAnnotationByStudentWorkIdAndType(
      componentState.id,
      'autoScore'
    );
    if (annotation != null) {
      this.tryToAddOpenResponseAnnotationIdeas(row, columnNameToNumber, annotation);
      this.tryToAddOpenResponseAnnotationScores(row, columnNameToNumber, annotation);
    }
  }

  private tryToAddOpenResponseAnnotationIdeas(
    row: any[],
    columnNameToNumber: any,
    annotation: any
  ): void {
    if (annotation.data.ideas != null) {
      for (const idea of annotation.data.ideas) {
        row[columnNameToNumber[`${this.ideaLabel} ${idea.name}`]] = idea.detected ? 1 : 0;
      }
    }
  }

  private tryToAddOpenResponseAnnotationScores(
    row: any[],
    columnNameToNumber: any,
    annotation: any
  ): void {
    if (annotation.data.scores != null) {
      for (const score of annotation.data.scores) {
        row[columnNameToNumber[`${this.scoreLabel} ${score.id}`]] = score.score;
      }
    } else if (annotation.data.value != null) {
      row[columnNameToNumber[`${this.autoScoreLabel}`]] = annotation.data.value;
    }
  }

  protected getComponentTypeWithUnderscore(): string {
    return 'open_response';
  }
}
