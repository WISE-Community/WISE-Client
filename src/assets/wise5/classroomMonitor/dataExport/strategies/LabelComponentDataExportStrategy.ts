import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { ComponentRevisionCounter } from '../ComponentRevisionCounter';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class LabelComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  maxNumLabels: number;

  constructor(nodeId: string, component: any, additionalParams: ComponentDataExportParams) {
    super(nodeId, component, additionalParams);
    this.maxNumLabels = 0;
  }

  export(): void {
    this.controller.showDownloadingExportMessage();
    const components = [{ nodeId: this.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentDataExport(components).then((result) => {
      const columnNames = [];
      const columnNameToNumber = new Map<string, number>();
      let rows = [this.generateComponentHeaderRow(columnNames, columnNameToNumber)];
      rows = rows.concat(
        this.generateComponentWorkRows(this.component, columnNames, columnNameToNumber, this.nodeId)
      );
      this.addLabelHeaders(rows, this.maxNumLabels);
      const fileName = this.generateExportFileName(this.nodeId, this.component.id, 'label');
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  generateComponentWorkRow(
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
    labelComponentState: any
  ): string[] {
    const row = this.createStudentWorkExportRow(
      columnNames,
      columnNameToNumber,
      rowCounter,
      workgroupId,
      userId1,
      userId2,
      userId3,
      studentName1,
      studentName2,
      studentName3,
      periodName,
      componentRevisionCounter,
      labelComponentState
    );
    this.updateMaxNumLabelsIfNecessary(labelComponentState);
    for (const label of labelComponentState.studentData.labels) {
      row.push(label.text);
    }
    return row;
  }

  private updateMaxNumLabelsIfNecessary(labelComponentState: any): void {
    const numLabels = labelComponentState.studentData.labels.length;
    if (numLabels > this.maxNumLabels) {
      this.maxNumLabels = numLabels;
    }
  }

  private addLabelHeaders(rows: any[], maxNumLabels: number): void {
    for (let i = 1; i <= maxNumLabels; i++) {
      rows[0].push(`Label ${i}`);
    }
  }
}
