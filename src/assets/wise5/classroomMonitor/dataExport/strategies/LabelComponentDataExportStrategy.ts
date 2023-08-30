import { Component } from '../../../common/Component';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { ComponentRevisionCounter } from '../ComponentRevisionCounter';
import { UserIdsAndStudentNames } from '../UserIdsAndStudentNames';
import { AbstractComponentDataExportStrategy } from './AbstractComponentDataExportStrategy';

export class LabelComponentDataExportStrategy extends AbstractComponentDataExportStrategy {
  COMPONENT_TYPE = 'label';
  maxNumLabels: number = 0;

  constructor(component: Component, additionalParams: ComponentDataExportParams) {
    super(component, additionalParams);
    this.populateColumnNames();
  }

  export(): void {
    this.controller.showDownloadingExportMessage();
    const components = [{ nodeId: this.component.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentData(components, true, false, true).subscribe(() => {
      let rows = [this.generateComponentHeaderRow(this.columnNames)];
      rows = rows.concat(this.generateComponentWorkRows(this.component));
      this.addLabelHeaders(rows, this.maxNumLabels);
      this.controller.generateCSVFile(rows, this.generateExportFileName());
      this.controller.hideDownloadingExportMessage();
    });
  }

  generateComponentWorkRow(
    workgroupId: number,
    userIdsAndStudentNames: UserIdsAndStudentNames,
    periodName: string,
    componentRevisionCounter: ComponentRevisionCounter,
    labelComponentState: any
  ): string[] {
    const row = this.createStudentWorkExportRow(
      workgroupId,
      userIdsAndStudentNames,
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

  private addLabelHeaders(rows: string[][], maxNumLabels: number): void {
    for (let i = 1; i <= maxNumLabels; i++) {
      rows[0].push(`Label ${i}`);
    }
  }
}
