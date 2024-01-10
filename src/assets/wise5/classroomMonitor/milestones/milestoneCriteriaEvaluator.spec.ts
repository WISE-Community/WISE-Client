import { copy } from '../../common/object/object';
import { MilestoneCriteriaEvaluator } from './milestoneCriteriaEvaluator';
import aggregateAutoScoresSample from '../../../../app/services/sampleData/sample_aggregateAutoScores.json';
import satisfyCriterionSample from '../../../../app/services/sampleData/sample_satisfyCriterion.json';
import { createScoreCounts } from '../../../../app/services/milestone/milestone-test-functions';

const aggregateAutoScores50 = [
  {
    nodeId: 'node1',
    componentId: 'component1',
    stepTitle: 'Step 1.2: World',
    aggregateAutoScore: {
      ki: {
        counts: createScoreCounts([10, 10, 10, 10, 10]),
        scoreCount: 50
      }
    }
  }
];

let evaluator: MilestoneCriteriaEvaluator = new MilestoneCriteriaEvaluator();
describe('MilestoneCriteriaEvaluator', () => {
  isSatisfied();
});

function isSatisfied() {
  describe('isSatisfied()', () => {
    isSatisfied_percentOfScoresGreaterThan();
    isSatisfied_percentOfScoresGreaterThanOrEqualTo();
    isSatisfied_percentOfScoresLessThan();
    isSatisfied_percentOfScoresLessThanOrEqualTo();
    isSatisfied_percentOfScoresEqualTo();
    isSatisfied_percentOfScoresNotEqualTo();
  });
}

function isSatisfied_percentOfScoresGreaterThan() {
  it('should check is percent of scores greater than', () => {
    const satisfyCriterion = {
      function: 'percentOfScoresGreaterThan',
      componentId: 'component1',
      targetVariable: 'ki',
      value: 3,
      percentThreshold: 50
    };
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(false);
    satisfyCriterion.value = 2;
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(true);
  });
}

function isSatisfied_percentOfScoresGreaterThanOrEqualTo() {
  it('should check is percent of scores greater than or equal to', () => {
    const satisfyCriterion = {
      function: 'percentOfScoresGreaterThanOrEqualTo',
      componentId: 'component1',
      targetVariable: 'ki',
      value: 4,
      percentThreshold: 50
    };
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(false);
    satisfyCriterion.value = 3;
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(true);
  });
}

function isSatisfied_percentOfScoresLessThan() {
  it('should check is percent of scores less than', () => {
    const satisfyCriterion = {
      function: 'percentOfScoresLessThan',
      componentId: 'component1',
      targetVariable: 'ki',
      value: 3,
      percentThreshold: 50
    };
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(false);
    satisfyCriterion.value = 4;
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(true);
  });
}

function isSatisfied_percentOfScoresLessThanOrEqualTo() {
  it('should check is percent of scores less than or equal to', () => {
    const satisfyCriterion = {
      function: 'percentOfScoresLessThanOrEqualTo',
      componentId: 'component1',
      targetVariable: 'ki',
      value: 2,
      percentThreshold: 50
    };
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(false);
    satisfyCriterion.value = 3;
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(true);
  });
}

function isSatisfied_percentOfScoresEqualTo() {
  it('should check is percent of scores equal to', () => {
    const satisfyCriterion = {
      function: 'percentOfScoresEqualTo',
      componentId: 'component1',
      targetVariable: 'ki',
      value: 3,
      percentThreshold: 50
    };
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores50)).toEqual(false);
    const aggregateAutoScores = [
      {
        nodeId: 'node1',
        componentId: 'component1',
        stepTitle: 'Step 1.1: Hello',
        aggregateAutoScore: {
          ki: {
            counts: createScoreCounts([10, 0, 10, 0, 0]),
            scoreCount: 20
          }
        }
      }
    ];
    expect(evaluator.isSatisfied(satisfyCriterion, aggregateAutoScores)).toEqual(true);
  });
}

function isSatisfied_percentOfScoresNotEqualTo() {
  it('should check is percent of scores not equal to', () => {
    expect(evaluator.isSatisfied(satisfyCriterionSample, aggregateAutoScoresSample)).toEqual(true);
    const aggregateAutoScores = copy(aggregateAutoScoresSample);
    aggregateAutoScores[0].aggregateAutoScore.ki.counts = { 1: 1, 2: 0, 3: 2, 4: 0, 5: 0 };
    expect(evaluator.isSatisfied(satisfyCriterionSample, aggregateAutoScores)).toEqual(false);
  });
}
