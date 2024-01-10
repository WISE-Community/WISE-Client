export class MilestoneCriteriaEvaluator {
  isSatisfied(satisfyCriterion: any, aggregateAutoScores: any[]): boolean {
    return (
      satisfyCriterion.function === 'default' ||
      this.satisfyCriteriaFuncNameToFunc[satisfyCriterion.function](
        satisfyCriterion,
        aggregateAutoScores
      )
    );
  }

  private satisfyCriteriaFuncNameToFunc = {
    percentOfScoresGreaterThan: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.greaterThan
      );
    },
    percentOfScoresGreaterThanOrEqualTo: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.greaterThanEqualTo
      );
    },
    percentOfScoresLessThan: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.lessThan
      );
    },
    percentOfScoresLessThanOrEqualTo: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.lessThanEqualTo
      );
    },
    percentOfScoresEqualTo: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.equalTo
      );
    },
    percentOfScoresNotEqualTo: (satisfyCriterion: any, aggregateAutoScores: any[]) => {
      return this.isPercentOfScoresSatisfiesComparator(
        satisfyCriterion,
        aggregateAutoScores,
        this.notEqualTo
      );
    }
  };

  private isPercentOfScoresSatisfiesComparator(
    satisfyCriterion: any,
    aggregateAutoScores: any[],
    comparator: any
  ): boolean {
    const aggregateData = this.getAggregateData(satisfyCriterion, aggregateAutoScores);
    const possibleScores = this.getPossibleScores(aggregateData);
    const sum = this.getComparatorSum(satisfyCriterion, aggregateData, possibleScores, comparator);
    return this.isPercentThresholdSatisfied(satisfyCriterion, aggregateData, sum);
  }

  private getAggregateData(satisfyCriterion: any, aggregateAutoScores: any[]) {
    for (const aggregateAutoScore of aggregateAutoScores) {
      if (aggregateAutoScore.componentId === satisfyCriterion.componentId) {
        return aggregateAutoScore.aggregateAutoScore[satisfyCriterion.targetVariable];
      }
    }
    throw new Error(`Aggregate data not found for component ${satisfyCriterion.componentId}`);
  }

  private getPossibleScores(aggregateData: any) {
    return Object.keys(aggregateData.counts).map(Number).sort();
  }

  private getComparatorSum(
    satisfyCriterion: any,
    aggregateData: any,
    possibleScores: number[],
    comparator: any
  ): number {
    let sum = 0;
    for (const possibleScore of possibleScores) {
      if (comparator(possibleScore, satisfyCriterion.value)) {
        sum += aggregateData.counts[possibleScore];
      }
    }
    return sum;
  }

  private isPercentThresholdSatisfied(
    satisfyCriterion: any,
    aggregateData: any,
    sum: number
  ): boolean {
    const percentOfScores = (100 * sum) / aggregateData.scoreCount;
    return percentOfScores >= satisfyCriterion.percentThreshold;
  }

  private greaterThanEqualTo(a: number, b: number): boolean {
    return a >= b;
  }

  private greaterThan(a: number, b: number): boolean {
    return a > b;
  }

  private lessThanEqualTo(a: number, b: number): boolean {
    return a <= b;
  }

  private lessThan(a: number, b: number): boolean {
    return a < b;
  }

  private equalTo(a: number, b: number): boolean {
    return a === b;
  }

  private notEqualTo(a: number, b: number): boolean {
    return a !== b;
  }
}
