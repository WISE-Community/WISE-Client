import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { MatchContent } from '../../../components/match/MatchContent';
import { Bucket } from '../../../components/match/bucket';
import { Choice } from '../../../components/match/choice';

export class MatchComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  private correctnessLabel = 'Correctness';
  private isCorrectLabel = 'Is Correct';

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
    this.addAdditionalMatchHeaderColumns(component, headerRow);
    return headerRow;
  }

  private addAdditionalMatchHeaderColumns(component: any, headerRow: string[]): void {
    for (const choice of component.choices) {
      headerRow.push(choice.value);
    }
    if (this.componentHasCorrectAnswer(component)) {
      for (const choice of component.choices) {
        headerRow.push(`${choice.value} ${this.correctnessLabel}`);
      }
      headerRow.push(this.isCorrectLabel);
    }
  }

  private componentHasCorrectAnswer(component: MatchContent): boolean {
    return component.feedback.some((feedback: any) =>
      feedback.choices.some((choice: any) => choice.isCorrect)
    );
  }

  protected generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[] {
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

  protected setStudentWork(
    row: any[],
    columnNameToNumber: any,
    component: any,
    componentState: any
  ): void {
    super.setStudentWork(row, columnNameToNumber, component, componentState);
    if (component.choiceReuseEnabled) {
      this.insertMatchChoiceReuseValues(row, columnNameToNumber, component, componentState);
    } else {
      this.insertMatchDefaultValues(row, columnNameToNumber, component, componentState);
    }
    if (this.componentHasCorrectAnswer(component)) {
      this.setColumnValue(
        row,
        columnNameToNumber,
        this.isCorrectLabel,
        componentState.studentData.isCorrect ? 1 : 0
      );
    }
  }

  private insertMatchDefaultValues(
    row: string[],
    columnNameToNumber: any,
    component: any,
    matchComponentState: any
  ): void {
    matchComponentState.studentData.buckets.forEach((bucket: Bucket) => {
      bucket.items.forEach((item: Choice) => {
        this.setColumnValue(
          row,
          columnNameToNumber,
          item.value,
          this.getBucketValueById(component, bucket.id)
        );
        if (this.componentHasCorrectAnswer(component)) {
          this.setCorrectnessValue(row, columnNameToNumber, item);
        }
      });
    });
  }

  private insertMatchChoiceReuseValues(
    row: string[],
    columnNameToNumber: any,
    component: any,
    matchComponentState: any
  ): void {
    matchComponentState.studentData.buckets.forEach((bucket: Bucket) => {
      bucket.items.forEach((item: Choice) => {
        this.setBucketValue(row, columnNameToNumber, component, bucket, item);
        if (this.componentHasCorrectAnswer(component)) {
          this.setCorrectnessValueForChoiceReuse(row, columnNameToNumber, item);
        }
      });
    });
  }

  private setBucketValue(
    row: string[],
    columnNameToNumber: any,
    component: any,
    bucket: Bucket,
    item: Choice
  ): void {
    const previousValue = this.getColumnValue(row, columnNameToNumber, item.value);
    const bucketValue = this.getBucketValueById(component, bucket.id);
    this.setColumnValue(
      row,
      columnNameToNumber,
      item.value,
      previousValue === '' ? bucketValue : `${previousValue}, ${bucketValue}`
    );
  }

  private setCorrectnessValueForChoiceReuse(
    row: any[],
    columnNameToNumber: any,
    item: Choice
  ): void {
    const columnName = `${item.value} ${this.correctnessLabel}`;
    if (item.isCorrect == null) {
      // The item does not have an isCorrect field so we will not show anything in the cell.
    } else if (item.isCorrect) {
      this.mergeCorrectnessValue(row, columnNameToNumber, columnName, 1);
    } else {
      if (item.isIncorrectPosition) {
        this.mergeCorrectnessValue(row, columnNameToNumber, columnName, 2);
      } else {
        this.mergeCorrectnessValue(row, columnNameToNumber, columnName, 0);
      }
    }
  }

  /**
   * Matrix to determine the merged correctness value.
   * Legend
   * e = empty
   * 0 = incorrect
   * 1 = correct
   * 2 = correct bucket but incorrect position
   *        previous
   *        e 0 1 2
   *       --------
   * n  0 | 0 0 0 0
   * e  1 | 1 0 1 2
   * w  2 | 2 0 2 2
   * @param row: any[]
   * @param columnNameToNumber: any
   * @param columnName: string
   * @param newValue: number
   */
  private mergeCorrectnessValue(
    row: any,
    columnNameToNumber: any,
    columnName: string,
    newValue: number
  ): void {
    const previousValue = this.getColumnValue(row, columnNameToNumber, columnName);
    if (previousValue === '') {
      this.setColumnValue(row, columnNameToNumber, columnName, newValue);
    } else if (this.bothValuesAreCorrect(previousValue, newValue)) {
      this.setColumnValue(row, columnNameToNumber, columnName, 1);
    } else if (this.eitherValuesAreIncorrect(previousValue, newValue)) {
      this.setColumnValue(row, columnNameToNumber, columnName, 0);
    } else if (this.eitherValuesAreIncorrectPosition(previousValue, newValue)) {
      this.setColumnValue(row, columnNameToNumber, columnName, 2);
    }
  }

  private bothValuesAreCorrect(value1: number, value2: number): boolean {
    return value1 === 1 && value2 === 1;
  }

  private eitherValuesAreIncorrect(value1: number, value2: number): boolean {
    return value1 === 0 || value2 === 0;
  }

  private eitherValuesAreIncorrectPosition(value1: number, value2: number): boolean {
    return value1 === 2 || value2 === 2;
  }

  private getBucketValueById(component: any, id: string): string {
    if (id === '0') {
      return component.choicesLabel ? component.choicesLabel : 'Choices';
    }
    const bucket = component.buckets.find((bucket: any) => {
      return bucket.id === id;
    });
    return bucket ? bucket.value : '';
  }

  /**
   * Set the correctness boolean value into the cell.
   * @param row The row we are working on.
   * @param columnNameToNumber The mapping from column name to column number.
   * @param item The choice object.
   */
  private setCorrectnessValue(row: any[], columnNameToNumber: any, item: any): void {
    const columnName = `${item.value} ${this.correctnessLabel}`;
    if (item.isCorrect == null) {
      /*
       * The item does not have an isCorrect field so we will not show
       * anything in the cell.
       */
    } else if (item.isCorrect) {
      this.setColumnValue(row, columnNameToNumber, columnName, 1);
    } else {
      if (item.isIncorrectPosition) {
        this.setColumnValue(row, columnNameToNumber, columnName, 2);
      } else {
        this.setColumnValue(row, columnNameToNumber, columnName, 0);
      }
    }
  }

  protected getComponentTypeWithUnderscore(): string {
    return 'match';
  }
}
