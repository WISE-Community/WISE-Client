'use strict';

import { ComponentService } from '../componentService';
import { UtilService } from '../../services/utilService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/configService';
import { Observable } from 'rxjs';

@Injectable()
export class SummaryService extends ComponentService {
  componentsWithScoresSummary: string[];
  componentsWithResponsesSummary: string[];

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    protected UtilService: UtilService
  ) {
    super(UtilService);
    this.componentsWithScoresSummary = [
      'Animation',
      'AudioOscillator',
      'ConceptMap',
      'Discussion',
      'Draw',
      'Embedded',
      'Graph',
      'Label',
      'Match',
      'MultipleChoice',
      'OpenResponse',
      'Table'
    ];
    this.componentsWithResponsesSummary = ['MultipleChoice', 'Table'];
  }

  getComponentTypeLabel(): string {
    return $localize`Summary`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Summary';
    component.summaryNodeId = null;
    component.summaryComponentId = null;
    component.source = 'period';
    component.studentDataType = null;
    component.chartType = 'column';
    component.requirementToSeeSummary = 'submitWork';
    component.highlightCorrectAnswer = false;
    component.customLabelColors = [];
    return component;
  }

  componentHasWork(component) {
    return false;
  }

  isComponentTypeAllowed(componentType) {
    return ['HTML', 'OutsideURL', 'Summary'].indexOf(componentType) === -1;
  }

  isScoresSummaryAvailableForComponentType(componentType) {
    return this.componentsWithScoresSummary.indexOf(componentType) != -1;
  }

  isResponsesSummaryAvailableForComponentType(componentType) {
    return this.componentsWithResponsesSummary.indexOf(componentType) != -1;
  }

  getLatestClassmateStudentWork(
    nodeId: string,
    componentId: string,
    source: string
  ): Observable<any> {
    const runId = this.configService.getRunId();
    const periodId = this.configService.getPeriodId();
    return this.http.get(
      `/api/classmate/summary/student-work/${runId}/${periodId}/${nodeId}/${componentId}/${source}`
    );
  }

  getLatestClassmateScores(nodeId: string, componentId: string, source: string): Observable<any> {
    const runId = this.configService.getRunId();
    const periodId = this.configService.getPeriodId();
    return this.http.get(
      `/api/classmate/summary/scores/${runId}/${periodId}/${nodeId}/${componentId}/${source}`
    );
  }
}
