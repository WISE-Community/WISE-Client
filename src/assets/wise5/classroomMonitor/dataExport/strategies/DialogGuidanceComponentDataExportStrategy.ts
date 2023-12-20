import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class DialogGuidanceComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  private computerLabel = 'Computer';
  private ideaLabel = 'Idea';
  private itemIdLabel = 'Item ID';
  private responseLabel = 'Response';
  private scoreLabel = 'Score';
  private studentLabel = 'Student';

  constructor(
    protected nodeId: string,
    protected component: any,
    additionalParams: ComponentDataExportParams,
    protected allOrLatest: 'all' | 'latest'
  ) {
    super(nodeId, component, additionalParams);
  }

  protected generateComponentHeaderRow(component: any): string[] {
    const headerRow = [...this.defaultColumnNames];
    this.addDialogGuidanceSpecificHeaderColumns(component, headerRow);
    return headerRow;
  }

  private addDialogGuidanceSpecificHeaderColumns(component: any, headerRow: string[]): void {
    headerRow.push(this.itemIdLabel);
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    const ideaNames = this.getIdeaNames(componentStates);
    const scoreNames = this.getScoreNames(componentStates);
    for (let i = 1; i <= this.getMaxNumberOfStudentResponses(componentStates); i++) {
      const responseLabelNumber = `${this.responseLabel} ${i}`;
      headerRow.push(`${this.studentLabel} ${responseLabelNumber}`);
      this.addIdeaNamesToHeaderRow(headerRow, ideaNames, responseLabelNumber);
      this.addScoreNamesToHeaderRow(headerRow, scoreNames, responseLabelNumber);
      headerRow.push(`${this.computerLabel} ${responseLabelNumber}`);
    }
  }

  private getIdeaNames(componentStates: any[]): string[] {
    for (const componentState of componentStates) {
      for (const response of componentState.studentData.responses) {
        if (response.ideas != null && response.ideas.length > 0) {
          return this.getIdeaNamesFromIdeas(response.ideas);
        }
      }
    }
    return [];
  }

  private getIdeaNamesFromIdeas(ideas: any[]): string[] {
    const ideaNames = [];
    for (const idea of ideas) {
      ideaNames.push(idea.name);
    }
    return ideaNames.sort(this.sortIdeaNames);
  }

  private sortIdeaNames(a: any, b: any): number {
    const aInt = parseInt(a);
    const bInt = parseInt(b);
    // If a and b are the same number but one of them contains a letter, we will sort
    // alphabetically. When a string like "5a" is given to parseInt(), it will return 5. Therefore
    // if we are comparing "5" and "5a", we will sort alphabetically because we want 5 to show up
    // before 5a.
    if (!isNaN(aInt) && !isNaN(bInt) && aInt !== bInt) {
      // sort numerically
      return aInt - bInt;
    } else {
      // sort alphabetically
      return a.localeCompare(b);
    }
  }

  private getScoreNames(componentStates: any[]): string[] {
    for (const componentState of componentStates) {
      for (const response of componentState.studentData.responses) {
        if (response.scores != null && response.scores.length > 0) {
          return this.getScoreNamesFromScores(response.scores);
        }
      }
    }
    return [];
  }

  private getScoreNamesFromScores(scores: any[]): string[] {
    const scoreNames = [];
    for (const score of scores) {
      scoreNames.push(score.id);
    }
    return scoreNames.sort();
  }

  private getMaxNumberOfStudentResponses(componentStates: any[]): number {
    let maxNumberOfResponses = 0;
    for (const componentState of componentStates) {
      const numberOfStudentResponses = this.getNumberOfStudentResponses(componentState);
      if (numberOfStudentResponses > maxNumberOfResponses) {
        maxNumberOfResponses = numberOfStudentResponses;
      }
    }
    return maxNumberOfResponses;
  }

  private getNumberOfStudentResponses(componentState: any): number {
    let count = 0;
    for (const response of componentState.studentData.responses) {
      if (response.user === 'Student') {
        count++;
      }
    }
    return count;
  }

  private addIdeaNamesToHeaderRow(
    headerRow: string[],
    ideaNames: string[],
    responseLabelNumber: string
  ): void {
    for (const ideaName of ideaNames) {
      headerRow.push(`${this.ideaLabel} ${ideaName} ${responseLabelNumber}`);
    }
  }

  private addScoreNamesToHeaderRow(
    headerRow: string[],
    scoreNames: string[],
    responseLabelNumber: string
  ): void {
    if (scoreNames.length === 0) {
      headerRow.push(`${this.scoreLabel} ${responseLabelNumber}`);
    } else {
      for (const scoreName of scoreNames) {
        headerRow.push(`${this.scoreLabel} ${scoreName} ${responseLabelNumber}`);
      }
    }
  }

  protected generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[] {
    const workRows = [];
    const componentStates = this.getComponentStates(component);
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
    this.setColumnValue(row, columnNameToNumber, this.itemIdLabel, component.itemId);
  }

  protected setStudentWork(
    row: any[],
    columnNameToNumber: any,
    component: any,
    componentState: any
  ): void {
    super.setStudentWork(row, columnNameToNumber, component, componentState);
    let studentResponseCounter = 0;
    let responseLabelNumber = '';
    for (const response of componentState.studentData.responses) {
      if (response.user === 'Student') {
        studentResponseCounter++;
        responseLabelNumber = `${this.responseLabel} ${studentResponseCounter}`;
        this.addStudentResponseToRow(row, columnNameToNumber, responseLabelNumber, response);
      } else if (response.user === 'Computer') {
        this.addComputerResponseDataToRow(row, columnNameToNumber, responseLabelNumber, response);
      }
    }
  }

  private addStudentResponseToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    response: any
  ): void {
    this.setColumnValue(
      row,
      columnNameToNumber,
      `${this.studentLabel} ${responseLabelNumber}`,
      response.text
    );
  }

  private addComputerResponseDataToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    response: any
  ): void {
    if (response.ideas != null) {
      this.addIdeasToRow(row, columnNameToNumber, responseLabelNumber, response.ideas);
    }
    if (response.scores != null) {
      this.addScoresToRow(row, columnNameToNumber, responseLabelNumber, response.scores);
    }
    if (response.score != null) {
      this.addScoreToRow(row, columnNameToNumber, responseLabelNumber, response.score);
    }
    this.addComputerResponseToRow(row, columnNameToNumber, responseLabelNumber, response.text);
  }

  private addIdeasToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    ideas: any[]
  ): void {
    for (const ideaObject of ideas) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        `${this.ideaLabel} ${ideaObject.name} ${responseLabelNumber}`,
        ideaObject.detected ? 1 : 0
      );
    }
  }

  private addScoresToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    scores: any[]
  ): void {
    for (const scoreObject of scores) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        `${this.scoreLabel} ${scoreObject.id} ${responseLabelNumber}`,
        scoreObject.score
      );
    }
  }

  private addScoreToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    score: number
  ): void {
    this.setColumnValue(
      row,
      columnNameToNumber,
      `${this.scoreLabel} ${responseLabelNumber}`,
      score
    );
  }

  private addComputerResponseToRow(
    row: any[],
    columnNameToNumber: any,
    responseLabelNumber: string,
    text: string
  ): void {
    this.setColumnValue(
      row,
      columnNameToNumber,
      `${this.computerLabel} ${responseLabelNumber}`,
      text
    );
  }

  protected getComponentTypeWithUnderscore(): string {
    return 'dialog_guidance';
  }
}
