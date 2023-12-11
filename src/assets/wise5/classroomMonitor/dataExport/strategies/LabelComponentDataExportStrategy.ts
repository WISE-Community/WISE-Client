import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class LabelComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
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
    const componentStates = this.teacherDataService.getComponentStatesByComponentId(component.id);
    const maxCountLabel = this.getMaxLabelCount(componentStates);
    for (let i = 1; i <= maxCountLabel; i++) {
      headerRow.push(`Label ${i}`);
    }
    return headerRow;
  }

  private getMaxLabelCount(componentStates: any[]): number {
    let maxLabelCount = 0;
    for (const componentState of componentStates) {
      const labelCount = componentState.studentData.labels.length;
      if (labelCount > maxLabelCount) {
        maxLabelCount = labelCount;
      }
    }
    return maxLabelCount;
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
    componentState.studentData.labels.forEach((label: any, index: number) => {
      this.setColumnValue(row, columnNameToNumber, `Label ${index + 1}`, label.text);
    });
  }

  protected getComponentTypeWithUnderscore(): string {
    return 'label';
  }
}
