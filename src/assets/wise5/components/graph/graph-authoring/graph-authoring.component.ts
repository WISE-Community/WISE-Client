'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { GraphService } from '../graphService';
import { isMultipleYAxes } from '../util';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { filter } from 'rxjs/operators';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'graph-authoring',
  templateUrl: 'graph-authoring.component.html',
  styleUrls: ['graph-authoring.component.scss']
})
export class GraphAuthoring extends AbstractComponentAuthoring {
  availableGraphTypes = [
    {
      value: 'line',
      text: $localize`Line Plot`
    },
    {
      value: 'column',
      text: $localize`Column Plot`
    },
    {
      value: 'scatter',
      text: $localize`Scatter Plot`
    }
  ];

  availableRoundingOptions = [
    {
      value: null,
      text: $localize`No Rounding`
    },
    {
      value: 'integer',
      text: $localize`Integer (example 1)`
    },
    {
      value: 'tenth',
      text: $localize`Tenth (exapmle 0.1)`
    },
    {
      value: 'hundredth',
      text: $localize`Hundredth (example 0.01)`
    }
  ];

  availableSymbols = [
    {
      value: 'circle',
      text: $localize`Circle`
    },
    {
      value: 'square',
      text: $localize`Square`
    },
    {
      value: 'triangle',
      text: $localize`Triangle`
    },
    {
      value: 'triangle-down',
      text: $localize`Triangle Down`
    },
    {
      value: 'diamond',
      text: $localize`Diamond`
    }
  ];

  availableSeriesTypes = [
    {
      value: 'line',
      text: $localize`Line`
    },
    {
      value: 'scatter',
      text: $localize`Point`
    }
  ];

  availableLineTypes = [
    {
      value: 'Solid',
      text: $localize`Solid`
    },
    {
      value: 'Dash',
      text: $localize`Dash`
    },
    {
      value: 'Dot',
      text: $localize`Dot`
    },
    {
      value: 'ShortDash',
      text: $localize`Short Dash`
    },
    {
      value: 'ShortDot',
      text: $localize`Short Dot`
    }
  ];

  availableXAxisTypes = [
    {
      value: 'limits',
      text: $localize`Limits`
    },
    {
      value: 'categories',
      text: $localize`Categories`
    }
  ];

  plotTypeToLimitType = {
    line: 'limits',
    scatter: 'limits',
    column: 'categories'
  };

  defaultDashStyle: string = 'Solid';
  enableMultipleYAxes: boolean = false;
  numYAxes: number = 0;

  constructor(
    protected ConfigService: ConfigService,
    private dialog: MatDialog,
    private GraphService: GraphService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.enableMultipleYAxes = isMultipleYAxes(this.componentContent.yAxis);
    if (this.enableMultipleYAxes) {
      this.numYAxes = this.componentContent.yAxis.length;
    }
    this.addAnyMissingYAxisFieldsToAllYAxes(this.componentContent.yAxis);
  }

  addSeriesClicked(): void {
    const newSeries: any = this.createNewSeries();
    if (this.componentContent.graphType === 'line') {
      newSeries.type = 'line';
      newSeries.dashStyle = 'Solid';
    } else if (this.componentContent.graphType === 'scatter') {
      newSeries.type = 'scatter';
    }
    if (this.enableMultipleYAxes) {
      newSeries.yAxis = 0;
      this.setSeriesColorToMatchYAxisColor(newSeries);
    }
    this.componentContent.series.push(newSeries);
    this.componentChanged();
  }

  createNewSeries(): any {
    return {
      name: '',
      data: [],
      marker: {
        symbol: 'circle'
      },
      canEdit: true
    };
  }

  deleteSeriesClicked(index: number): void {
    let message = '';
    let seriesName = '';
    if (this.componentContent.series != null) {
      const series = this.componentContent.series[index];
      if (series != null && series.name != null) {
        seriesName = series.name;
      }
    }
    if (seriesName == null || seriesName === '') {
      message = $localize`Are you sure you want to delete the series?`;
    } else {
      message = $localize`Are you sure you want to delete the "${seriesName}" series?`;
    }
    if (confirm(message)) {
      this.componentContent.series.splice(index, 1);
      this.componentChanged();
    }
  }

  enableTrialsClicked(): void {
    if (this.componentContent.enableTrials) {
      this.componentContent.canCreateNewTrials = true;
      this.componentContent.canDeleteTrials = true;
    } else {
      this.componentContent.canCreateNewTrials = false;
      this.componentContent.canDeleteTrials = false;
      this.componentContent.hideAllTrialsOnNewTrial = true;
    }
    this.componentChanged();
  }

  addXAxisCategory(): void {
    this.componentContent.xAxis.categories.push('');
    this.componentChanged();
  }

  deleteXAxisCategory(index: number): void {
    let confirmMessage = '';
    let categoryName = '';
    if (this.componentContent.xAxis != null && this.componentContent.xAxis.categories != null) {
      categoryName = this.componentContent.xAxis.categories[index];
    }
    if (categoryName == null || categoryName === '') {
      confirmMessage = $localize`Are you sure you want to delete the category?`;
    } else {
      confirmMessage = $localize`Are you sure you want to delete the "${categoryName}" category?`;
    }
    if (confirm(confirmMessage)) {
      this.componentContent.xAxis.categories.splice(index, 1);
      this.componentChanged();
    }
  }

  addSeriesDataPoint(series: any): void {
    if (series != null && series.data != null) {
      if (
        this.componentContent.xAxis.type == null ||
        this.componentContent.xAxis.type === 'limits'
      ) {
        series.data.push([]);
      } else if (this.componentContent.xAxis.type === 'categories') {
        series.data.push(0);
      }
    }
    this.componentChanged();
  }

  deleteSeriesDataPoint(series: any, index: number): void {
    if (series != null && series.data != null) {
      if (confirm($localize`Are you sure you want to delete the data point?`)) {
        series.data.splice(index, 1);
        this.componentChanged();
      }
    }
  }

  moveSeriesDataPointUp(series: any, index: number): void {
    if (index > 0) {
      const dataPoint = series.data[index];
      series.data.splice(index, 1);
      series.data.splice(index - 1, 0, dataPoint);
    }
    this.componentChanged();
  }

  moveSeriesDataPointDown(series: any, index: number): void {
    if (index < series.data.length - 1) {
      const dataPoint = series.data[index];
      series.data.splice(index, 1);
      series.data.splice(index + 1, 0, dataPoint);
    }
    this.componentChanged();
  }

  xAxisTypeChanged(newValue: any, oldValue: string): void {
    if (oldValue === 'categories' && newValue === 'limits') {
      delete this.componentContent.xAxis.categories;
      this.componentContent.xAxis.min = 0;
      this.componentContent.xAxis.max = 10;
      this.convertAllSeriesDataPoints(newValue);
    } else if (
      (oldValue === 'limits' || oldValue === '' || oldValue == null) &&
      newValue === 'categories'
    ) {
      delete this.componentContent.xAxis.min;
      delete this.componentContent.xAxis.max;
      delete this.componentContent.xAxis.units;
      delete this.componentContent.yAxis.units;
      this.componentContent.xAxis.categories = [$localize`Category One`, $localize`Category Two`];
      this.convertAllSeriesDataPoints(newValue);
    }
    this.componentChanged();
  }

  convertAllSeriesDataPoints(xAxisType: string): void {
    const series = this.componentContent.series;
    for (const singleSeries of series) {
      this.convertSeriesDataPoints(singleSeries, xAxisType);
    }
  }

  convertSeriesDataPoints(series: any, xAxisType: string): void {
    const data = series.data;
    const convertedData = [];
    for (let d = 0; d < data.length; d++) {
      const oldDataPoint = data[d];
      if (xAxisType == null || xAxisType === '' || xAxisType === 'limits') {
        if (!Array.isArray(oldDataPoint)) {
          convertedData.push([d + 1, oldDataPoint]);
        } else {
          convertedData.push(oldDataPoint);
        }
      } else if (xAxisType === 'categories') {
        if (Array.isArray(oldDataPoint)) {
          convertedData.push(oldDataPoint[1]);
        } else {
          convertedData.push(oldDataPoint);
        }
      }
    }
    series.data = convertedData;
  }

  enableMultipleYAxesChanged(): void {
    if (this.enableMultipleYAxes) {
      this.convertSingleYAxisToMultipleYAxes();
      this.numYAxes = this.componentContent.yAxis.length;
      this.addYAxisToAllSeries();
      this.addColorToYAxes();
      this.addColorToSeries();
      this.componentChanged();
    } else {
      if (confirm($localize`Are you sure you want to remove multiple Y axes?`)) {
        this.convertMultipleYAxesToSingleYAxis();
        this.numYAxes = this.componentContent.yAxis.length;
        this.removeYAxisFromAllSeries();
        this.componentChanged();
      } else {
        this.enableMultipleYAxes = true;
      }
    }
  }

  convertSingleYAxisToMultipleYAxes(): void {
    const firstYAxis = this.componentContent.yAxis;
    this.addAnyMissingYAxisFields(firstYAxis);
    const secondYAxis = this.createYAxisObject();
    secondYAxis.opposite = true;
    this.componentContent.yAxis = [firstYAxis, secondYAxis];
  }

  createYAxisObject(): any {
    return {
      title: {
        text: '',
        useHTML: true,
        style: {
          color: null
        }
      },
      labels: {
        style: {
          color: null
        }
      },
      min: 0,
      max: 100,
      units: '',
      locked: true,
      useDecimals: false,
      opposite: false
    };
  }

  convertMultipleYAxesToSingleYAxis(): void {
    this.componentContent.yAxis = this.componentContent.yAxis[0];
  }

  addYAxisToAllSeries(): void {
    for (const singleSeries of this.componentContent.series) {
      singleSeries.yAxis = 0;
    }
  }

  removeYAxisFromAllSeries(): void {
    for (const singleSeries of this.componentContent.series) {
      delete singleSeries.yAxis;
    }
  }

  addColorToYAxes(): void {
    for (let index = 0; index < this.componentContent.yAxis.length; index++) {
      const yAxis = this.componentContent.yAxis[index];
      const color = this.GraphService.getSeriesColor(index);
      this.addColorToField(yAxis.title.style, color);
      this.addColorToField(yAxis.labels.style, color);
    }
  }

  addColorToField(field: any, color: string): void {
    if (field.color == null || field.color === '') {
      field.color = color;
    }
  }

  addColorToSeries(): void {
    for (const singleSeries of this.componentContent.series) {
      this.setSeriesColorToMatchYAxisColor(singleSeries);
    }
  }

  setSeriesColorToMatchYAxisColor(series: any): void {
    series.color = this.getYAxisColor(series.yAxis);
  }

  getYAxisColor(index: number): string {
    return this.componentContent.yAxis[index].labels.style.color;
  }

  numYAxesChanged(newValue: number, oldValue: number): void {
    if (newValue > oldValue) {
      this.increaseYAxes(newValue);
      this.addColorToYAxes();
      this.componentChanged();
    } else if (newValue < oldValue) {
      if (confirm($localize`Are you sure you want to decrease the number of Y Axes?`)) {
        this.decreaseYAxes(newValue);
        this.updateSeriesYAxesIfNecessary();
        this.componentChanged();
      } else {
        this.numYAxes = oldValue;
      }
    }
  }

  increaseYAxes(newNumYAxes: number): void {
    const oldNumYAxes = this.componentContent.yAxis.length;
    const numYAxesToAdd = newNumYAxes - oldNumYAxes;
    for (let n = 0; n < numYAxesToAdd; n++) {
      this.componentContent.yAxis.push(this.createYAxisObject());
    }
  }

  decreaseYAxes(newNumYAxes: number): void {
    this.componentContent.yAxis = this.componentContent.yAxis.slice(0, newNumYAxes);
  }

  updateSeriesYAxesIfNecessary(): void {
    for (const singleSeries of this.componentContent.series) {
      if (!this.isYAxisIndexExists(singleSeries.yAxis)) {
        singleSeries.yAxis = 0;
        this.setSeriesColorToMatchYAxisColor(singleSeries);
      }
    }
  }

  isYAxisIndexExists(yAxisIndex: number): boolean {
    return this.componentContent.yAxis[yAxisIndex] != null;
  }

  yAxisColorChanged(yAxisIndex: number): void {
    const yAxis = this.componentContent.yAxis[yAxisIndex];
    const color = yAxis.labels.style.color;
    yAxis.title.style.color = color;
    this.updateSeriesColors(yAxisIndex, color);
    this.componentChanged();
  }

  updateSeriesColors(yAxisIndex: number, color: string): void {
    for (const singleSeries of this.componentContent.series) {
      if (singleSeries.yAxis === yAxisIndex) {
        singleSeries.color = color;
      }
    }
  }

  addAnyMissingYAxisFieldsToAllYAxes(yAxis: any): void {
    if (isMultipleYAxes(yAxis)) {
      yAxis.forEach((yAxis) => this.addAnyMissingYAxisFields(yAxis));
    } else {
      this.addAnyMissingYAxisFields(yAxis);
    }
  }

  addAnyMissingYAxisFields(yAxis: any): void {
    if (yAxis.title == null) {
      yAxis.title = {};
    }
    if (yAxis.title.style == null) {
      yAxis.title.style = {};
    }
    if (yAxis.title.style.color == null) {
      yAxis.title.style.color = '';
    }
    if (yAxis.labels == null) {
      yAxis.labels = {};
    }
    if (yAxis.labels.style == null) {
      yAxis.labels.style = {};
    }
    if (yAxis.labels.style.color == null) {
      yAxis.labels.style.color = '';
    }
    if (yAxis.allowDecimals == null) {
      yAxis.allowDecimals = false;
    }
    if (yAxis.opposite == null) {
      yAxis.opposite = false;
    }
  }

  seriesYAxisChanged(series: any): void {
    series.yAxis = parseInt(series.yAxis);
    this.setSeriesColorToMatchYAxisColor(series);
    this.componentChanged();
  }

  graphTypeChanged(): void {
    const graphType = this.componentContent.graphType;
    this.updateAllSeriesPlotTypes(graphType);
    this.changeXAxisTypeIfNecessary(graphType);
    this.componentChanged();
  }

  updateAllSeriesPlotTypes(plotType: string): void {
    const multipleSeries = this.componentContent.series;
    for (const singleSeries of multipleSeries) {
      singleSeries.type = plotType;
      this.updateDashStyleField(singleSeries);
    }
  }

  changeXAxisTypeIfNecessary(graphType: string): void {
    const oldXAxisType = this.componentContent.xAxis.type;
    const newXAxisType = this.plotTypeToLimitType[graphType];
    if (oldXAxisType != newXAxisType) {
      this.componentContent.xAxis.type = newXAxisType;
      this.xAxisTypeChanged(newXAxisType, oldXAxisType);
    }
  }

  seriesTypeChanged(series: any): void {
    this.updateDashStyleField(series);
    this.componentChanged();
  }

  updateDashStyleField(series: any): void {
    if (series.type === 'line') {
      series.dashStyle = this.defaultDashStyle;
    } else {
      delete series.dashStyle;
    }
  }

  customTrackBy(index: number): number {
    return index;
  }
}
