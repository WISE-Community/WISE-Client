import * as covariance from 'compute-covariance';
import { addPointFromTableIntoData, calculateMean, isMultipleYAxes, isSingleYAxis } from './util';
import { Series } from './domain/series';

export class DataExplorerManager {
  dataExplorerColors: string[] = ['blue', 'orange', 'purple', 'black', 'green'];

  constructor(
    private xAxis: any,
    private yAxis: any,
    private activeTrial: any
  ) {}

  handleDataExplorer(studentData: any): Series[] {
    this.xAxis.title.text = studentData.dataExplorerXAxisLabel;
    this.setYAxisLabels(studentData);
    this.setXAxisLabels(studentData);
    return this.addAllSeries(studentData);
  }

  private addAllSeries(studentData: any): Series[] {
    const allRegressionSeries = [];
    const dataExplorerSeries = studentData.dataExplorerSeries;
    for (let seriesIndex = 0; seriesIndex < dataExplorerSeries.length; seriesIndex++) {
      if (dataExplorerSeries[seriesIndex].yColumn != null) {
        const color = this.dataExplorerColors[seriesIndex];
        this.addSeries(studentData, dataExplorerSeries[seriesIndex], seriesIndex, color);
        this.handleRegressionSeries(
          studentData,
          dataExplorerSeries[seriesIndex],
          color,
          allRegressionSeries
        );
      }
    }
    return allRegressionSeries;
  }

  private addSeries(
    studentData: any,
    singleDataExplorerSeries: any,
    seriesIndex: number,
    color: string
  ): void {
    const series = this.generateDataExplorerSeries(
      studentData.tableData,
      singleDataExplorerSeries.xColumn,
      singleDataExplorerSeries.yColumn,
      studentData.dataExplorerGraphType,
      singleDataExplorerSeries.name,
      color,
      singleDataExplorerSeries.yAxis,
      studentData.dataExplorerTooltipHeaderColumn
    );
    if (series.yAxis == null) {
      this.setSeriesYAxisIndex(series, seriesIndex);
    }
    this.activeTrial.series.push(series);
  }

  private handleRegressionSeries(
    studentData: any,
    singleDataExplorerSeries: any,
    color: string,
    allRegressionSeries: any[]
  ): void {
    if (this.shouldAddRegressionSeries(studentData)) {
      this.addRegressionSeries(
        studentData.tableData,
        singleDataExplorerSeries.xColumn,
        singleDataExplorerSeries.yColumn,
        color,
        singleDataExplorerSeries.yAxis,
        allRegressionSeries
      );
    }
  }

  private shouldAddRegressionSeries(studentData: any): boolean {
    return (
      studentData.dataExplorerGraphType === 'scatter' &&
      studentData.isDataExplorerScatterPlotRegressionLineEnabled
    );
  }

  private addRegressionSeries(
    tableData: any[][],
    xColumn: number,
    yColumn: number,
    color: string,
    yAxis: number,
    allRegressionSeries: Series[]
  ): void {
    const singleRegressionSeries = this.generateDataExplorerRegressionSeries(
      tableData,
      xColumn,
      yColumn,
      color,
      yAxis
    );
    allRegressionSeries.push(singleRegressionSeries);
  }

  private setYAxisLabels(studentData: any): void {
    if (isSingleYAxis(this.yAxis)) {
      this.yAxis.title.text = studentData.dataExplorerYAxisLabel;
    } else if (studentData.dataExplorerYAxisLabels != null) {
      for (let [index, yAxis] of Object.entries(this.yAxis)) {
        this.setYAxisAttributes(studentData, yAxis, index);
      }
    }
  }

  private setYAxisAttributes(studentData: any, yAxis: any, index: string): void {
    yAxis.title.text = studentData.dataExplorerYAxisLabels[index];
    const yAxisIndex = studentData.dataExplorerSeries[index].yAxis;
    yAxis.title.style.color = this.dataExplorerColors[yAxisIndex];
    yAxis.labels.style.color = this.dataExplorerColors[yAxisIndex];
  }

  private setSeriesYAxisIndex(series: Series, seriesIndex: number): void {
    if (this.hasMultipleYAxes(this.yAxis)) {
      if (seriesIndex === 0 || seriesIndex === 1) {
        series.yAxis = seriesIndex;
      } else {
        series.yAxis = 0;
      }
    }
  }

  private hasMultipleYAxes(yAxis: any): boolean {
    return isMultipleYAxes(yAxis) && yAxis.length == 2;
  }

  private setXAxisLabels(studentData: any): void {
    const thisComponent = this;
    this.xAxis.labels = {
      formatter: function () {
        if (thisComponent.shouldGenerateDataExplorerLabel(this.value, studentData)) {
          // try to convert the x value number to a category string on the x axis
          const textValue = thisComponent.getXColumnTextValue(
            studentData.dataExplorerSeries,
            studentData.tableData,
            this.value
          );
          if (thisComponent.shouldGetColumnLabel(textValue)) {
            return studentData.tableData[this.value + 1][studentData.dataExplorerSeries[0].xColumn]
              .text;
          }
        }
        return this.value;
      }
    };
  }

  private shouldGenerateDataExplorerLabel(value: number, studentData: any): boolean {
    return (
      value + 1 < studentData.tableData.length &&
      studentData.isDataExplorerEnabled != null &&
      studentData.dataExplorerSeries != null &&
      studentData.tableData != null
    );
  }

  private shouldGetColumnLabel(textValue: string): boolean {
    return (
      typeof textValue === 'string' &&
      textValue !== '' &&
      !this.isNA(textValue) &&
      isNaN(Number(textValue))
    );
  }

  private getXColumnTextValue(
    dataExplorerSeries: any[],
    tableData: any[][],
    value: number
  ): string {
    const xColumn = dataExplorerSeries[0].xColumn;
    const dataRow = tableData[value + 1];
    return dataRow[xColumn].text;
  }

  private isNA(text: string): boolean {
    const textUpperCase = text.toUpperCase();
    return textUpperCase === 'NA' || textUpperCase === 'N/A';
  }

  private generateDataExplorerSeries(
    tableData: any[][],
    xColumn: number,
    yColumn: number,
    graphType: string,
    name: string,
    color: string,
    yAxis: any,
    tooltipHeaderColumn: number
  ): Series {
    const series: Series = {
      type: graphType,
      name: name,
      color: color,
      yAxis: yAxis,
      data: this.convertDataExplorerDataToSeriesData(
        tableData,
        xColumn,
        yColumn,
        tooltipHeaderColumn
      )
    };
    if (graphType === 'line') {
      series.data.sort(this.sortLineData);
    }
    return series;
  }

  private sortLineData(a, b): number {
    if (a[0] > b[0]) {
      return 1;
    } else if (a[0] < b[0]) {
      return -1;
    } else {
      if (a[1] > b[1]) {
        return 1;
      } else if (a[1] < b[1]) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  private convertDataExplorerDataToSeriesData(
    rows: any[],
    xColumn: number,
    yColumn: number,
    tooltipHeaderColumn: number
  ): any[] {
    const data = [];
    rows.slice(1).forEach((row: any) => {
      const xCell = row[xColumn];
      const yCell = row[yColumn];
      if (this.isValidDataPoint(xCell, yCell)) {
        const tooltipHeader = row[tooltipHeaderColumn]?.text;
        addPointFromTableIntoData(xCell, yCell, data, tooltipHeader);
      }
    });
    return data;
  }

  private isValidDataPoint(xCell: any, yCell: any): boolean {
    return xCell != null && yCell != null;
  }

  private generateDataExplorerRegressionSeries(
    tableData: any[][],
    xColumn: number,
    yColumn: number,
    color: string,
    yAxis: number
  ): Series {
    const regressionLineData = this.calculateRegressionLineData(tableData, xColumn, yColumn);
    return {
      type: 'line',
      name: 'Regression Line',
      color: color,
      data: regressionLineData,
      yAxis: yAxis,
      enableMouseTracking: false
    };
  }

  private calculateRegressionLineData(
    tableData: any[][],
    xColumn: number,
    yColumn: number
  ): any[][] {
    const xValues = this.getValuesInColumn(tableData, xColumn);
    const yValues = this.getValuesInColumn(tableData, yColumn);
    const covarianceMatrix = covariance(xValues, yValues);
    const covarianceXY = covarianceMatrix[0][1];
    const varianceX = covarianceMatrix[0][0];
    const meanY = calculateMean(yValues);
    const meanX = calculateMean(xValues);
    const slope = covarianceXY / varianceX;
    const intercept = meanY - slope * meanX;
    let firstX = Math.min(...xValues);
    let firstY = slope * firstX + intercept;
    if (firstY < 0) {
      firstY = 0;
      firstX = (firstY - intercept) / slope;
    }
    let secondX = Math.max(...xValues);
    let secondY = slope * secondX + intercept;
    if (secondY < 0) {
      secondY = 0;
      secondX = (secondY - intercept) / slope;
    }
    return [
      [firstX, firstY],
      [secondX, secondY]
    ];
  }

  private getValuesInColumn(tableData: any[][], columnIndex: number): any[] {
    const values = [];
    for (let r = 1; r < tableData.length; r++) {
      const row = tableData[r];
      const value = Number(row[columnIndex].text);
      values.push(value);
    }
    return values;
  }
}
