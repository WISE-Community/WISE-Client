'use strict';

import * as html2canvas from 'html2canvas';
import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';
import { StudentAssetService } from '../../services/studentAssetService';
import { ConfigService } from '../../services/configService';
import { HttpClient } from '@angular/common/http';
import { convertToPNGFile } from '../../common/canvas/canvas';
import { hasConnectedComponent } from '../../common/ComponentContent';

@Injectable()
export class GraphService extends ComponentService {
  seriesColors: string[] = ['blue', 'red', 'green', 'orange', 'purple', 'black'];

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private StudentAssetService: StudentAssetService
  ) {
    super();
  }

  getComponentTypeLabel(): string {
    return $localize`Graph`;
  }

  /**
   * Create a Graph component object
   * @returns a new Graph component object
   */
  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Graph';
    component.title = '';
    component.width = 800;
    component.height = 500;
    component.enableTrials = false;
    component.canCreateNewTrials = false;
    component.canDeleteTrials = false;
    component.hideAllTrialsOnNewTrial = false;
    component.canStudentHideSeriesOnLegendClick = false;
    component.roundValuesTo = 'integer';
    component.graphType = 'line';
    component.xAxis = {
      title: {
        text: $localize`Time (seconds)`,
        useHTML: true
      },
      min: 0,
      max: 100,
      units: $localize`s`,
      locked: true,
      type: 'limits',
      allowDecimals: false
    };
    component.yAxis = {
      title: {
        text: $localize`Position (meters)`,
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
      units: $localize`m`,
      locked: true,
      allowDecimals: false
    };
    component.series = [
      {
        name: $localize`Prediction`,
        data: [],
        color: 'blue',
        dashStyle: 'Solid',
        marker: {
          symbol: 'circle'
        },
        canEdit: true,
        type: 'line'
      }
    ];
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    if (this.canEdit(component)) {
      return this.hasCompletedComponentState(componentStates, node, component);
    } else {
      return this.hasNodeEnteredEvent(nodeEvents);
    }
  }

  hasCompletedComponentState(componentStates: any[], node: any, component: any) {
    if (this.hasComponentStates(componentStates)) {
      if (this.isSubmitRequired(node, component)) {
        return this.hasSubmitComponentState(componentStates);
      } else {
        const latestComponentState = componentStates[componentStates.length - 1];
        return this.componentStateHasStudentWork(latestComponentState);
      }
    }
    return false;
  }

  hasComponentStates(componentStates: any[]) {
    return componentStates != null && componentStates.length > 0;
  }

  hasSubmitComponentState(componentStates: any[]) {
    for (const componentState of componentStates) {
      if (componentState.isSubmit && this.componentStateHasStudentWork(componentState)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determine if the student can perform any work on this component.
   * @param component The component content.
   * @return Whether the student can perform any work on this component.
   */
  canEdit(component: any): boolean {
    const series = component.series;
    for (const singleSeries of series) {
      if (singleSeries.canEdit) {
        return true;
      }
    }
    return hasConnectedComponent(component, 'importWork');
  }

  hasSeriesData(studentData: any) {
    const series = studentData.series;
    if (series != null) {
      for (const singleSeries of series) {
        if (singleSeries.data != null && singleSeries.data.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  hasTrialData(studentData: any) {
    const trials = studentData.trials;
    if (trials != null) {
      for (const trial of trials) {
        for (const singleSeries of trial.series) {
          const seriesData = singleSeries.data;
          if (seriesData.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any = null) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null && this.isStudentDataHasWork(studentData)) {
        return true;
      }
      if (this.isStudentChangedAxisLimit(componentState, componentContent)) {
        return true;
      }
    }
    return false;
  }

  isStudentDataHasWork(studentData: any) {
    if (studentData.version == 1) {
      /*
       * this is the old graph student data format where the
       * student data can contain multiple series.
       */
      if (this.anySeriesHasDataPoint(studentData.series)) {
        return true;
      }
    } else {
      /*
       * this is the new graph student data format where the student data can contain multiple
       * trials and each trial can contain multiple series.
       */
      if (this.anyTrialHasDataPoint(studentData.trials)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the student has changed any of the axis limits
   * @param componentState the component state
   * @param componentContent the component content
   * @return whether the student has changed any of the axis limits
   */
  isStudentChangedAxisLimit(componentState: any, componentContent: any) {
    if (componentState != null && componentState.studentData != null && componentContent != null) {
      if (
        this.isXAxisChanged(componentState, componentContent) ||
        this.isYAxisChanged(componentState, componentContent)
      ) {
        return true;
      }
    }
    return false;
  }

  isXAxisChanged(componentState: any, componentContent: any) {
    if (componentState.studentData.xAxis != null && componentContent.xAxis != null) {
      if (
        componentState.studentData.xAxis.min != componentContent.xAxis.min ||
        componentState.studentData.xAxis.max != componentContent.xAxis.max
      ) {
        return true;
      }
    }
    return false;
  }

  isYAxisChanged(componentState: any, componentContent: any) {
    if (componentState.studentData.yAxis != null && componentContent.yAxis != null) {
      if (
        componentState.studentData.yAxis.min != componentContent.yAxis.min ||
        componentState.studentData.yAxis.max != componentContent.yAxis.max
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if any of the trials contains a data point
   * @param trials an array of trials
   * @return whether any of the trials contains a data point
   */
  anyTrialHasDataPoint(trials: any[]) {
    for (const trial of trials) {
      if (this.trialHasDataPoint(trial)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a trial has a data point
   * @param trial a trial object which can contain multiple series
   * @return whether the trial contains a data point
   */
  trialHasDataPoint(trial: any) {
    for (const singleSeries of trial.series) {
      if (this.seriesHasDataPoint(singleSeries)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if an array of series has any data point
   * @param multipleSeries an array of series
   * @return whether any of the series has a data point
   */
  anySeriesHasDataPoint(multipleSeries: any[]) {
    if (multipleSeries != null) {
      for (const singleSeries of multipleSeries) {
        if (this.seriesHasDataPoint(singleSeries)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if a series has a data point
   * @param singleSeries a series object
   * @return whether the series object has any data points
   */
  seriesHasDataPoint(singleSeries: any) {
    return singleSeries.data.length > 0;
  }

  /**
   * The component state has been rendered in a <component></component> element
   * and now we want to take a snapshot of the work.
   * @param componentState The component state that has been rendered.
   * @return A promise that will return an image object.
   */
  generateImageFromRenderedComponentState(componentState: any) {
    return new Promise((resolve, reject) => {
      const highchartsDiv = this.getHighchartsDiv(componentState.componentId);
      html2canvas(highchartsDiv).then((canvas) => {
        const pngFile = convertToPNGFile(canvas);
        this.StudentAssetService.uploadAsset(pngFile).then((asset) => {
          resolve(asset);
        });
      });
    });
  }

  getHighchartsDiv(componentId: string) {
    return document.querySelector(`#chart_${componentId} .highcharts-container`);
  }

  getSeriesColor(index: number): string {
    return this.seriesColors[index];
  }

  createTooltipFormatter(xAxis: any, yAxis: any, roundValuesTo: string): any {
    const thisGraphService = this;
    return function () {
      let text = '';
      if (thisGraphService.isLimitXAxisType(xAxis)) {
        text = thisGraphService.getLimitAxisTypeTooltip(
          this,
          this.series,
          xAxis,
          yAxis,
          roundValuesTo
        );
      } else if (thisGraphService.isCategoriesXAxisType(xAxis)) {
        text = thisGraphService.getCategoriesAxisTypeTooltip(
          this,
          this.series,
          xAxis,
          yAxis,
          roundValuesTo
        );
      }
      if (thisGraphService.pointHasCustomTooltip(this.point)) {
        text += '<br/>' + this.point.tooltip;
      }
      return text;
    };
  }

  isLimitXAxisType(xAxis: any): boolean {
    return xAxis.type === 'limits' || xAxis.type == null;
  }

  isCategoriesXAxisType(xAxis: any): boolean {
    return xAxis.type === 'categories';
  }

  getLimitAxisTypeTooltip(
    point: any,
    series: any,
    xAxis: any,
    yAxis: any,
    roundValuesTo: string
  ): string {
    const tooltipHeader = this.getTooltipHeader(point, series, yAxis);
    const xText = this.getAxisTextForLimitGraph(series, point.x, 'xAxis', xAxis, roundValuesTo);
    const yText = this.getAxisTextForLimitGraph(series, point.y, 'yAxis', yAxis, roundValuesTo);
    return this.combineSeriesNameXTextYText(tooltipHeader, xText, yText);
  }

  getTooltipHeader(point: any, series: any, yAxis: any): string {
    let tooltipHeader = '';
    if (point.point.tooltipHeader) {
      tooltipHeader = point.point.tooltipHeader;
    } else {
      const yAxisLabel = this.getAxisTitle(series, yAxis);
      const seriesName = series.name;
      if (yAxisLabel !== seriesName) {
        tooltipHeader = seriesName;
      }
    }
    if (tooltipHeader !== '') {
      tooltipHeader = this.getBoldText(tooltipHeader);
    }
    return tooltipHeader;
  }

  getBoldText(text: string): string {
    return `<b>${text}</b>`;
  }

  getAxisTextForLimitGraph(
    series: any,
    num: number,
    axisName: string,
    axisObj: any,
    roundValuesTo: string
  ): string {
    const label = this.getAxisTitle(series, axisObj);
    const value = this.getValueForLimitGraph(series, num, roundValuesTo);
    const units = this.getAxisUnits(series, axisName, axisObj);
    return this.getPointDisplay(label, value, units);
  }

  getAxisTitle(series: any, axisObj: any): string {
    if (Array.isArray(axisObj)) {
      const axisIndex = series.options.yAxis == null ? series.index : series.options.yAxis;
      if (axisObj[axisIndex] != null) {
        if (axisObj[axisIndex].title.text == null || axisObj[axisIndex].title.text === '') {
          return series.name;
        } else {
          return axisObj[axisIndex].title.text;
        }
      }
    } else if (axisObj.title.text == null || axisObj.title.text === '') {
      return series.name;
    } else {
      return axisObj.title.text;
    }
  }

  getValueForLimitGraph(series: any, num: number, roundValuesTo: string): any {
    if (
      series.data[num] != null &&
      series.data[num].category === num &&
      series.data[num].name != null
    ) {
      return series.data[num].name;
    } else {
      return this.performRounding(num, roundValuesTo);
    }
  }

  getPointDisplay(label: string, value: any, units: string): string {
    return `${label}: <b>${value} ${units}</b>`;
  }

  combineSeriesNameXTextYText(seriesName: string, xText: string, yText: string): string {
    let text = '';
    if (seriesName !== '') {
      text += seriesName + '<br/>';
    }
    if (xText !== '') {
      text += xText + '<br/>';
    }
    if (yText !== '') {
      text += yText + '<br/>';
    }
    return text;
  }

  getCategoriesAxisTypeTooltip(
    point: any,
    series: any,
    xAxis: any,
    yAxis: any,
    roundValuesTo: string
  ): string {
    const tooltipHeader = this.getTooltipHeader(point, series, yAxis);
    const xText = this.getXTextForCategoriesGraph(
      series,
      point.point,
      point.x,
      xAxis,
      roundValuesTo
    );
    const yText = this.getYTextForCategoriesGraph(series, point.y, yAxis, roundValuesTo);
    return this.combineSeriesNameXTextYText(tooltipHeader, xText, yText);
  }

  getXTextForCategoriesGraph(
    series: any,
    point: any,
    x: number,
    xAxis: any,
    roundValuesTo: string
  ): string {
    const label = xAxis.title.text;
    const value = this.getXValueForCategoriesGraph(point, x, xAxis, roundValuesTo);
    const units = this.getAxisUnits(series, xAxis.name, xAxis);
    return this.getPointDisplay(label, value, units);
  }

  getXValueForCategoriesGraph(point: any, x: number, xAxis: any, roundValuesTo: string): any {
    const category = this.getCategoryByIndex(point.index, xAxis);
    if (category != null) {
      return category;
    } else if (point.category === x && point.name != null) {
      return point.name;
    } else {
      return this.performRounding(x, roundValuesTo);
    }
  }

  getCategoryByIndex(index: number, xAxis: any): string {
    if (xAxis != null && xAxis.categories != null && index < xAxis.categories.length) {
      return xAxis.categories[index];
    }
    return null;
  }

  getYTextForCategoriesGraph(series: any, y: number, axis: any, roundValuesTo: string): string {
    const label = this.getAxisTitle(series, axis);
    const value = this.performRounding(y, roundValuesTo);
    const units = this.getAxisUnits(series, axis.name, axis);
    return this.getPointDisplay(label, value, units);
  }

  performRounding(number: number, roundValuesTo: string): number {
    if (roundValuesTo === 'integer') {
      number = this.roundToNearestInteger(number);
    } else if (roundValuesTo === 'tenth') {
      number = this.roundToNearestTenth(number);
    } else if (roundValuesTo === 'hundredth') {
      number = this.roundToNearestHundredth(number);
    }
    return number;
  }

  roundToNearestInteger(x): number {
    return Math.round(parseFloat(x));
  }

  roundToNearestTenth(x): number {
    return this.roundToNearest(x, 10);
  }

  roundToNearestHundredth(x): number {
    return this.roundToNearest(x, 100);
  }

  roundToNearest(x: any, divisor: number): number {
    return Math.round(parseFloat(x) * divisor) / divisor;
  }

  getAxisUnits(series: any, axisName: string, axisObj: any): string {
    if (
      series[axisName] != null &&
      series[axisName].userOptions != null &&
      series[axisName].userOptions.units != null
    ) {
      return series[axisName].userOptions.units;
    } else if (axisObj.units != null) {
      return axisObj.units;
    } else {
      return '';
    }
  }

  pointHasCustomTooltip(point: any): boolean {
    return point.tooltip != null && point.tooltip !== '';
  }

  getPlotBandsFromTrials(trials: any[]): any[] {
    let trialPlotBands = [];
    for (const trial of trials) {
      if (trial.show && trial.xAxis != null && trial.xAxis.plotBands != null) {
        trialPlotBands = trialPlotBands.concat(trial.xAxis.plotBands);
      }
    }
    return trialPlotBands;
  }

  getSeriesFromTrials(trials: any[]): any[] {
    let series = [];
    for (const trial of trials) {
      if (trial.show) {
        series = series.concat(trial.series);
      }
    }
    return series;
  }

  getClassmateStudentWork(
    nodeId: string,
    componentId: string,
    periodId: number,
    showWorkNodeId: string,
    showWorkComponentId: string,
    showClassmateWorkSource: 'period' | 'class'
  ) {
    const runId = this.configService.getRunId();
    if (showClassmateWorkSource === 'period') {
      return this.http.get(
        `/api/classmate/graph/student-work/${runId}/${nodeId}/${componentId}/${showWorkNodeId}/${showWorkComponentId}/period/${periodId}`
      );
    } else {
      return this.http.get(
        `/api/classmate/graph/student-work/${runId}/${nodeId}/${componentId}/${showWorkNodeId}/${showWorkComponentId}/class`
      );
    }
  }
}
