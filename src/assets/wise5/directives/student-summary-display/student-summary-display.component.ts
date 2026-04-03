import { Component } from '@angular/core';
import { SummaryDisplayComponent } from '../summary-display/summary-display.component';
import { StudentDataService } from '../../services/studentDataService';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { Annotation } from '../../common/Annotation';
import { ComponentState } from '../../../../app/domain/componentState';
import { of } from 'rxjs';
import { copy } from '../../common/object/object';
import { DummyAnnotation } from '../../common/DummyAnnotation';
import { DummyComponentState } from '../../../../app/domain/dummyComponentState';
import { Choice } from '../../components/multipleChoice/Choice';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';

@Component({
  imports: [CommonModule, HighchartsChartModule],
  selector: 'student-summary-display',
  styleUrl: '../summary-display/summary-display.component.scss',
  templateUrl: '../summary-display/summary-display.component.html'
})
export class StudentSummaryDisplay extends SummaryDisplayComponent {
  private studentWorkSavedToServerSubscription: Subscription = new Subscription();
  numDummySamples: number;

  ngOnInit(): void {
    this.setNumDummySamples();
    super.ngOnInit();
    this.initializeChangeListeners();
  }

  setNumDummySamples(): void {
    switch (this.source) {
      case 'period':
        this.numDummySamples = 10;
        break;
      case 'allPeriods':
        this.numDummySamples = 20;
        break;
      default:
        this.numDummySamples = 1;
        break;
    }
  }

  ngOnDestroy(): void {
    this.studentWorkSavedToServerSubscription.unsubscribe();
  }

  private initializeChangeListeners(): void {
    this.studentWorkSavedToServerSubscription = (
      this.dataService as StudentDataService
    ).studentWorkSavedToServer$.subscribe((componentState) => {
      if (
        this.doRender &&
        componentState.nodeId === this.nodeId &&
        componentState.componentId === this.componentId
      ) {
        this.renderDisplay();
      }
    });
  }

  protected getLatestScores(): Observable<Annotation[]> {
    let latestScores: Observable<Annotation[]>;
    if (this.isVLEPreview()) {
      latestScores = this.getDummyStudentScoresForVLEPreview();
    } else if (this.isAuthoringPreview()) {
      latestScores = this.getDummyStudentScoresForAuthoringPreview();
    } else {
      latestScores = this.getLatestStudentScores();
    }
    return latestScores;
  }

  protected getLatestWork(): Observable<ComponentState[]> {
    if (this.isVLEPreview()) {
      return this.getDummyStudentWorkForVLEPreview(this.nodeId, this.componentId);
    } else if (this.isAuthoringPreview()) {
      return this.getDummyStudentWorkForAuthoringPreview();
    } else {
      return this.getLatestStudentWork();
    }
  }

  private getDummyStudentWorkForVLEPreview(
    nodeId: string,
    componentId: string
  ): Observable<ComponentState[]> {
    const componentStates = this.createDummyComponentStates();
    const componentState = (
      this.dataService as StudentDataService
    ).getLatestComponentStateByNodeIdAndComponentId(nodeId, componentId);
    if (componentState != null) {
      componentStates.push(componentState);
    }
    return of(componentStates);
  }

  private getDummyStudentScoresForVLEPreview(): Observable<Annotation[]> {
    const annotations = this.createDummyScoreAnnotations();
    const annotation = this.getLatestScoreAnnotationForWorkgroup();
    if (annotation != null) {
      annotations.push(annotation);
    }
    return of(annotations);
  }

  private getDummyStudentWorkForAuthoringPreview(): Observable<ComponentState[]> {
    return of(this.createDummyComponentStates());
  }

  private getDummyStudentScoresForAuthoringPreview(): Observable<Annotation[]> {
    return of(this.createDummyScoreAnnotations());
  }

  private createDummyComponentStates(): DummyComponentState[] {
    const dummyComponentStates = [];
    for (let dummyCounter = 0; dummyCounter < this.numDummySamples; dummyCounter++) {
      dummyComponentStates.push(this.createDummyComponentState());
    }
    return dummyComponentStates;
  }

  private createDummyComponentState(): DummyComponentState {
    if (this.otherComponentType === 'MultipleChoice') {
      return this.createDummyMultipleChoiceComponentState(
        this.otherComponent as MultipleChoiceContent
      );
    } else if (this.otherComponentType === 'Table') {
      return this.createDummyTableComponentState();
    }
  }

  private createDummyMultipleChoiceComponentState(componentState: MultipleChoiceContent): any {
    const choices = componentState.choices;
    return {
      studentData: {
        studentChoices: [{ id: this.getRandomChoice(choices).id }]
      }
    };
  }

  private createDummyTableComponentState(): any {
    if (this.isAuthoringPreview()) {
      return {
        studentData: {
          tableData: this.getDummyTableData()
        }
      };
    } else {
      return {
        studentData: {
          tableData: this.getDummyTableDataSimilarToLatestComponentState()
        }
      };
    }
  }

  private getDummyTableData(): any[] {
    return [
      [{ text: 'Trait' }, { text: 'Count' }],
      [{ text: 'Blue' }, { text: '3' }],
      [{ text: 'Green' }, { text: '2' }],
      [{ text: 'Red' }, { text: '1' }]
    ];
  }

  private getDummyTableDataSimilarToLatestComponentState(): any[] {
    let tableData = [];
    const componentState = (
      this.dataService as StudentDataService
    ).getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);
    tableData = copy(componentState.studentData.tableData);
    for (let r = 1; r < tableData.length; r++) {
      tableData[r][1].text = this.getRandomSimilarNumber(tableData[r][1].text);
    }
    return tableData;
  }

  private getRandomSimilarNumber(text: string): number {
    return Math.ceil(this.summaryService.convertToNumber(text) * Math.random());
  }

  private getRandomChoice(choices: Choice[]): any {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  private createDummyScoreAnnotations(): DummyAnnotation[] {
    const dummyScoreAnnotations = [];
    for (let dummyCounter = 0; dummyCounter < this.numDummySamples; dummyCounter++) {
      dummyScoreAnnotations.push(this.createDummyScoreAnnotation());
    }
    return dummyScoreAnnotations;
  }

  private createDummyScoreAnnotation(): DummyAnnotation {
    const json = {
      data: {
        value: this.getRandomScore()
      },
      type: 'score'
    };
    return new DummyAnnotation(json);
  }

  private getRandomScore(): number {
    return Math.ceil(Math.random() * this.maxScore);
  }

  protected renderSelfDisplay(): void {
    switch (this.studentDataType) {
      case 'responses':
        this.renderSelfResponse();
        break;
      case 'scores':
        this.renderSelfScore();
        break;
    }
  }

  private renderSelfResponse(): void {
    const componentStates = [];
    const componentState = this.getResponseForSelf();
    if (componentState != null) {
      componentStates.push(componentState);
    }
    const [seriesData, count] = this.processComponentStates(componentStates);
    this.renderGraph(seriesData, count);
  }

  private getResponseForSelf(): ComponentState {
    if (this.isVLEPreview() || this.isStudentRun()) {
      return (this.dataService as StudentDataService).getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    } else if (this.isAuthoringPreview()) {
      return this.createDummyComponentState();
    }
  }

  private renderSelfScore(): void {
    this.setMaxScore();
    const annotation = this.getScoreForSelf();
    const annotations = [];
    if (annotation != null) {
      annotations.push(annotation);
    }
    this.processScoreAnnotations(annotations);
  }

  private getScoreForSelf(): Annotation {
    let score: Annotation;
    if (this.isVLEPreview() || this.isStudentRun()) {
      score = this.getLatestScoreAnnotationForWorkgroup();
    } else if (this.isAuthoringPreview()) {
      score = this.createDummyScoreAnnotation();
    }
    return score;
  }
}
