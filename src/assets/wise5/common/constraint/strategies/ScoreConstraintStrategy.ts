import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class ScoreConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const latestScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      criteria.params.nodeId,
      criteria.params.componentId,
      this.configService.getWorkgroupId(),
      'any'
    );
    return (
      latestScoreAnnotation != null && this.isScoreInExpectedScores(criteria, latestScoreAnnotation)
    );
  }

  isScoreInExpectedScores(criteria: any, scoreAnnotation: any): boolean {
    const scoreValue = this.dataService.getScoreValueFromScoreAnnotation(
      scoreAnnotation,
      criteria.params.scoreId
    );
    return this.dataService.isScoreInExpectedScores(criteria.params.scores, scoreValue);
  }
}
