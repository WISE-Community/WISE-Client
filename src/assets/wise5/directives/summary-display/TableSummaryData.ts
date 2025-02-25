import { ComponentState } from '../../../../app/domain/componentState';
import { TableSummaryDataPoint } from './TableSummaryDataPoint';

export class TableSummaryData {
  private summaryDataPoints: TableSummaryDataPoint[];

  constructor(componentStates: ComponentState[]) {
    componentStates.forEach((componentState) => {
      const tableData = componentState.studentData.tableData;
      for (let r = 1; r < tableData.length; r++) {
        const row = tableData[r];
        const key = row[0].text;
        const value = row[1].text;
        if (key != '') {
          this.accumulateLabel(this.cleanLabel(key), value);
        }
      }
    });
  }

  accumulateLabel(key: string, value: any): void {
    let dataPoint = this.getDataPointById(key);
    if (dataPoint == null) {
      dataPoint = new TableSummaryDataPoint(key);
      this.summaryDataPoints.push(dataPoint);
    }
    dataPoint.incrementCount(this.convertToNumber(value));
  }

  // FULLY DUPLICATE METHOD (maybe move to SummaryService??)
  private cleanLabel(label: string): string {
    return (label + '')
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.substr(1);
        } else {
          return '';
        }
      })
      .join(' ');
  }

  // FULLY DUPLICATE METHOD
  private convertToNumber(value: any): number {
    if (!isNaN(Number(value))) {
      return Number(value);
    } else {
      return 0;
    }
  }

  getDataPointById(id: string): TableSummaryDataPoint {
    this.summaryDataPoints.forEach((dataPoint) => {
      if (dataPoint.getId() === id) {
        return dataPoint;
      }
    });
    return null;
  }
}
