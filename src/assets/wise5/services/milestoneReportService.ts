import { Injectable } from '@angular/core';
import { AnnotationService } from './annotationService';
import { ProjectService } from './projectService';
import { MilestoneCriteriaEvaluator } from '../classroomMonitor/milestones/milestoneCriteriaEvaluator';
import { Annotation } from '../common/Annotation';
import { isMatchingPeriods } from '../common/period/period';

@Injectable()
export class MilestoneReportService {
  private milestoneCriteriaEvaluator = new MilestoneCriteriaEvaluator();

  constructor(
    private annotationService: AnnotationService,
    private projectService: ProjectService
  ) {}

  generate(projectAchievement: any, periodId: number): any {
    const componentAggregateAutoScores = this.getComponentAggregateAutoScores(
      projectAchievement,
      periodId
    );
    const template = this.chooseTemplate(
      projectAchievement.report.templates,
      componentAggregateAutoScores
    );
    let content = template.content ? template.content : '';
    if (content) {
      content = this.processMilestoneGraphsAndData(content, componentAggregateAutoScores);
    }
    return {
      content: content,
      recommendations: template.recommendations ? template.recommendations : ''
    };
  }

  private getComponentAggregateAutoScores(projectAchievement: any, periodId: number): any[] {
    const componentAggregateAutoScores = [];
    for (const referencedComponent of projectAchievement.report.locations) {
      const componentAggregateAutoScore = this.getComponentAggregateAutoScore(
        referencedComponent.nodeId,
        referencedComponent.componentId,
        periodId,
        projectAchievement.report
      );
      componentAggregateAutoScores.push(componentAggregateAutoScore);
    }
    return componentAggregateAutoScores;
  }

  private getComponentAggregateAutoScore(
    nodeId: string,
    componentId: string,
    periodId: number,
    report: any
  ): any {
    const aggregateAutoScore: any = this.calculateAggregateAutoScores(
      nodeId,
      componentId,
      periodId,
      report
    );
    return {
      nodeId: nodeId,
      componentId: componentId,
      stepTitle: this.projectService.getNodePositionAndTitle(nodeId),
      aggregateAutoScore: aggregateAutoScore
    };
  }

  calculateAggregateAutoScores(
    nodeId: string,
    componentId: string,
    periodId: number,
    reportSettings: any
  ) {
    const aggregate = {};
    const scoreAnnotations = this.getAllLatestScoreAnnotations(nodeId, componentId, periodId);
    for (const scoreAnnotation of scoreAnnotations) {
      if (scoreAnnotation.type === 'autoScore') {
        this.addDataToAggregate(aggregate, scoreAnnotation, reportSettings);
      } else {
        const autoScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
          nodeId,
          componentId,
          scoreAnnotation.toWorkgroupId,
          'autoScore'
        );
        if (autoScoreAnnotation) {
          const mergedAnnotation = this.mergeAutoScoreAndTeacherScore(
            autoScoreAnnotation,
            scoreAnnotation,
            reportSettings
          );
          this.addDataToAggregate(aggregate, mergedAnnotation, reportSettings);
        }
      }
    }
    return aggregate;
  }

  private getAllLatestScoreAnnotations(
    nodeId: string,
    componentId: string,
    periodId: number
  ): Annotation[] {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(nodeId, componentId)
      .filter(
        (annotation) =>
          isMatchingPeriods(annotation.periodId, periodId) &&
          ['autoScore', 'score'].includes(annotation.type)
      )
      .reduceRight(
        (latestAnnotations, annotation) =>
          latestAnnotations.some(
            (latestAnnotation) => latestAnnotation.toWorkgroupId === annotation.toWorkgroupId
          )
            ? latestAnnotations
            : latestAnnotations.concat(annotation),
        []
      );
  }

  private mergeAutoScoreAndTeacherScore(
    autoScoreAnnotation: any,
    teacherScoreAnnotation: any,
    reportSettings: any
  ) {
    if (autoScoreAnnotation.data.scores) {
      for (const subScore of autoScoreAnnotation.data.scores) {
        if (subScore.id === 'ki') {
          subScore.score = this.adjustKIScore(teacherScoreAnnotation.data.value, reportSettings);
        }
      }
    }
    return autoScoreAnnotation;
  }

  adjustKIScore(scoreValue: number, reportSettings: any) {
    const teacherScore = Math.round(scoreValue);
    const kiScoreBounds = this.getKIScoreBounds(reportSettings);
    let score = teacherScore;
    if (teacherScore > kiScoreBounds.max) {
      score = kiScoreBounds.max;
    }
    if (teacherScore < kiScoreBounds.min) {
      score = kiScoreBounds.min;
    }
    return score;
  }

  getKIScoreBounds(reportSettings: any) {
    const bounds = {
      min: 1,
      max: 5
    };
    if (reportSettings.customScoreValues && reportSettings.customScoreValues['ki']) {
      bounds.min = Math.min(...reportSettings.customScoreValues['ki']);
      bounds.max = Math.max(...reportSettings.customScoreValues['ki']);
    }
    return bounds;
  }

  addDataToAggregate(aggregate: any, annotation: any, reportSettings: any) {
    for (const subScore of annotation.data.scores) {
      if (aggregate[subScore.id] == null) {
        aggregate[subScore.id] = this.setupAggregateSubScore(subScore.id, reportSettings);
      }
      const subScoreVal = subScore.score;
      if (aggregate[subScore.id].counts[subScoreVal] > -1) {
        aggregate[subScore.id].counts[subScoreVal]++;
        aggregate[subScore.id].scoreSum += subScoreVal;
        aggregate[subScore.id].scoreCount++;
        aggregate[subScore.id].average =
          aggregate[subScore.id].scoreSum / aggregate[subScore.id].scoreCount;
      }
    }
    return aggregate;
  }

  setupAggregateSubScore(subScoreId: string, reportSettings: any) {
    let counts = {};
    if (reportSettings.customScoreValues && reportSettings.customScoreValues[subScoreId]) {
      counts = this.getCustomScoreValueCounts(reportSettings.customScoreValues[subScoreId]);
    } else {
      counts = this.getPossibleScoreValueCounts(subScoreId);
    }
    return {
      scoreSum: 0,
      scoreCount: 0,
      counts: counts,
      average: 0
    };
  }

  getCustomScoreValueCounts(scoreValues: any[]) {
    let counts = {};
    for (const value of scoreValues) {
      counts[value] = 0;
    }
    return counts;
  }

  getPossibleScoreValueCounts(subScoreId: string) {
    if (subScoreId === 'ki') {
      return {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
    } else {
      return {
        1: 0,
        2: 0,
        3: 0
      };
    }
  }

  chooseTemplate(templates: any[], aggregateAutoScores: any[]) {
    for (const template of templates) {
      if (this.isTemplateMatch(template, aggregateAutoScores)) {
        return template;
      }
    }
    return {
      content: null
    };
  }

  isTemplateMatch(template: any, aggregateAutoScores: any[]): boolean {
    const matchedCriteria = [];
    for (const satisfyCriterion of template.satisfyCriteria) {
      if (this.milestoneCriteriaEvaluator.isSatisfied(satisfyCriterion, aggregateAutoScores)) {
        matchedCriteria.push(satisfyCriterion);
      }
    }
    if (template.satisfyConditional === 'all') {
      return matchedCriteria.length === template.satisfyCriteria.length;
    } else if (template.satisfyConditional === 'any') {
      return matchedCriteria.length > 0;
    }
  }

  processMilestoneGraphsAndData(content: any, componentAggregateAutoScores: any): string {
    const aggregateDataBySubScoreId = this.getAggregateDataBySubScoreId(
      componentAggregateAutoScores
    );
    for (const [subScoreId, subScoreData] of Object.entries(aggregateDataBySubScoreId)) {
      const data = JSON.stringify(subScoreData).replace(/\"/g, "'");
      const graphRegex = new RegExp(`milestone-report-graph{1,} id="(${subScoreId})"`, 'g');
      content = content.replace(graphRegex, `$& data=\"${data}\"`);
      const dataRegex = new RegExp(`milestone-report-data{1,} score-id="(${subScoreId})"`, 'g');
      content = content.replace(dataRegex, `$& data=\"${data}\"`);
    }
    return content;
  }

  private getAggregateDataBySubScoreId(componentAggregateAutoScores: any[]): any {
    const aggregateDataBySubScoreId = {};
    for (const componentAggregateAutoScore of componentAggregateAutoScores) {
      const aggregateAutoScore = componentAggregateAutoScore.aggregateAutoScore;
      for (const subScoreId of Object.keys(aggregateAutoScore)) {
        const aggregateData = aggregateAutoScore[subScoreId];
        this.addAggregateDataBySubScoreId(
          aggregateDataBySubScoreId,
          subScoreId,
          aggregateData,
          componentAggregateAutoScore.nodeId,
          componentAggregateAutoScore.componentId,
          componentAggregateAutoScore.stepTitle
        );
      }
    }
    return aggregateDataBySubScoreId;
  }

  private addAggregateDataBySubScoreId(
    aggregateDataBySubScoreId: any,
    subScoreId: string,
    aggregateData: any,
    nodeId: string,
    componentId: string,
    stepTitle: string
  ): void {
    if (aggregateDataBySubScoreId[subScoreId] == null) {
      aggregateDataBySubScoreId[subScoreId] = [];
    }
    this.injectAdditionalFieldsIntoAggregateData(aggregateData, nodeId, componentId, stepTitle);
    aggregateDataBySubScoreId[subScoreId].push(aggregateData);
  }

  private injectAdditionalFieldsIntoAggregateData(
    aggregateData: any,
    nodeId: string,
    componentId: string,
    stepTitle: string
  ): any {
    aggregateData.nodeId = nodeId;
    aggregateData.componentId = componentId;
    aggregateData.stepTitle = stepTitle;
    return aggregateData;
  }
}
