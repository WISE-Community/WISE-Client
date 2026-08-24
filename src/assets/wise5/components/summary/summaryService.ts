'use strict';

import { ComponentService } from '../componentService';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class SummaryService extends ComponentService {
  protected type: string = 'Summary';
  private http = inject(HttpClient);
  componentsWithScoresSummary: string[] = [
    'Animation',
    'AudioOscillator',
    'ConceptMap',
    'DialogGuidance',
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
  componentsWithResponsesSummary: string[] = [
    'DialogGuidance',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'Table'
  ];

  createComponent() {
    const component: any = super.createComponent();
    component.type = this.type;
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

  cleanLabel(label: string): string {
    return (label + '')
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.substr(1) : ''))
      .join(' ');
  }

  convertToNumber(value: any): number {
    return isNaN(Number(value)) ? 0 : Number(value);
  }
}
