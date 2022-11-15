'use strict';

import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SummaryService extends ComponentService {
  componentsWithScoresSummary: string[];
  componentsWithResponsesSummary: string[];

  constructor(private http: HttpClient) {
    super();
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
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    source: string
  ): Observable<any> {
    if (source === 'period') {
      return this.http.get(
        `/api/classmate/summary/student-work/${runId}/${nodeId}/${componentId}/period/${periodId}`
      );
    } else {
      return this.http.get(
        `/api/classmate/summary/student-work/${runId}/${nodeId}/${componentId}/class`
      );
    }
  }

  getLatestClassmateScores(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    source: string
  ): Observable<any> {
    if (source === 'period') {
      return this.http.get(
        `/api/classmate/summary/scores/${runId}/${nodeId}/${componentId}/period/${periodId}`
      );
    } else {
      return this.http.get(`/api/classmate/summary/scores/${runId}/${nodeId}/${componentId}/class`);
    }
  }
}
