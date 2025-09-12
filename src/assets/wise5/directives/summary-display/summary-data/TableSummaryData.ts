import { ComponentState } from '../../../../../app/domain/componentState';
import { SummaryService } from '../../../components/summary/summaryService';
import { SummaryData } from './SummaryData';
import { TableSummaryDataPoint } from './TableSummaryDataPoint';

export class TableSummaryData extends SummaryData {
  protected summaryDataPoints: TableSummaryDataPoint[];

  constructor(componentStates: ComponentState[], summaryService: SummaryService) {
    super();
    componentStates.forEach((componentState) => {
      const tableData = componentState.studentData.tableData;
      for (let r = 1; r < tableData.length; r++) {
        const row = tableData[r];
        const key = row[0].text;
        const value = row[1].text;
        if (key != '') {
          this.accumulateLabel(summaryService.cleanLabel(key), value, summaryService);
        }
      }
    });
  }

  private accumulateLabel(key: string, value: any, summaryService: SummaryService): void {
    let dataPoint = this.getDataPointById(key);
    if (dataPoint == null) {
      dataPoint = new TableSummaryDataPoint(key);
      this.summaryDataPoints.push(dataPoint);
    }
    dataPoint.incrementCount(summaryService.convertToNumber(value));
  }

  getDataPoints(): TableSummaryDataPoint[] {
    return this.summaryDataPoints;
  }

  protected generateNewDataPoint(id: string | number): TableSummaryDataPoint {
    return new TableSummaryDataPoint(id);
  }
}
