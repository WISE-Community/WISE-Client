import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class OpenResponseComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  protected autoScoreLabel: string = 'Auto Score';
  protected ideaLabel: string = 'Idea';
  protected scoreLabel: string = 'Score';

  constructor(
    protected nodeId: string,
    protected component: any,
    additionalParams: ComponentDataExportParams,
    protected allOrLatest: 'all' | 'latest'
  ) {
    super(nodeId, component, additionalParams);
  }

  protected generateComponentHeaderRow(component: any, columnNameToNumber: any): string[] {
    const headerRow = [...this.defaultColumnNames];
    headerRow.push('Item ID');
    headerRow.push('Response');
    if (this.isCRaterEnabled(component)) {
      const annotations = this.annotationService.getAnnotationsByNodeIdComponentId(
        this.nodeId,
        component.id
      );
      this.tryToAddIdeaColumnNames(headerRow, annotations);
      this.tryToAddScoreColumnNames(headerRow, annotations);
    }
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
    const componentStates = this.getComponentStates(component);
    const workRows = [];
    for (let r = 0; r < componentStates.length; r++) {
      const componentState = componentStates[r];
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

  protected setComponentInfo(
    row: any[],
    columnNameToNumber: any,
    nodeId: string,
    component: any
  ): void {
    super.setComponentInfo(row, columnNameToNumber, nodeId, component);
    if (this.isCRaterEnabled(component)) {
      this.setColumnValue(row, columnNameToNumber, 'Item ID', component.cRater.itemId);
    }
  }

  protected setStudentWork(
    row: any[],
    columnNameToNumber: any,
    component: any,
    componentState: any
  ): void {
    super.setStudentWork(row, columnNameToNumber, component, componentState);
    this.setColumnValue(row, columnNameToNumber, 'Response', componentState.studentData.response);
    this.setAnnotationData(row, columnNameToNumber, componentState);
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
