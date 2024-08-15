import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MilestoneReportService } from '../../../assets/wise5/services/milestoneReportService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import aggregateAutoScoresSample from '../sampleData/sample_aggregateAutoScores.json';
import { copy } from '../../../assets/wise5/common/object/object';
import { createSatisfyCriteria, createScoreCounts } from './milestone-test-functions';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: MilestoneReportService;
const reportSettingsCustomScoreValuesSample = {
  customScoreValues: {
    ki: [1, 2, 3, 4]
  }
};

describe('MilestoneReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [MilestoneReportService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(MilestoneReportService);
  });

  addDataToAggregate();
  adjustKIScore();
  getKIScoreBounds();
  chooseTemplate();
  generate();
  getCustomScoreValueCounts();
  getPossibleScoreValueCounts();
  processMilestoneGraphsAndData();
  setupAggregateSubScore();
});

function addDataToAggregate() {
  describe('addDataToAggregate()', () => {
    it('should add annotation to the aggregate scores and return aggregate', () => {
      const annotation = {
        data: {
          scores: [
            {
              id: 'ki',
              score: 3
            }
          ]
        }
      };
      const aggregateAutoScore = copy(aggregateAutoScoresSample)[0].aggregateAutoScore;
      const result = service.addDataToAggregate(
        aggregateAutoScore,
        annotation,
        reportSettingsCustomScoreValuesSample
      );
      expect(result).toEqual({
        ki: {
          counts: { 1: 2, 2: 0, 3: 2, 4: 0, 5: 0 },
          scoreSum: 8,
          scoreCount: 4,
          average: 2
        }
      });
    });
  });
}

function adjustKIScore() {
  describe('adjustKIScore()', () => {
    it('should return the adjusted KI score', () => {
      const value = 5;
      expect(service.adjustKIScore(value, reportSettingsCustomScoreValuesSample)).toEqual(4);
    });
  });
}

function getKIScoreBounds() {
  describe('getKIScoreBounds()', () => {
    it('should return the KI score bounds', () => {
      expect(service.getKIScoreBounds(reportSettingsCustomScoreValuesSample)).toEqual({
        min: 1,
        max: 4
      });
    });
  });
}

function chooseTemplate() {
  describe('chooseTemplate()', () => {
    it('should choose template', () => {
      const template1 = {
        id: 'template-1'
      };
      const template2 = {
        id: 'template-2'
      };
      const templates = [template1, template2];
      const aggregateAutoScores = [];
      spyOn(service, 'isTemplateMatch').and.callFake((template, aggregateAutoScores) => {
        return template.id === 'template-2';
      });
      expect(service.chooseTemplate(templates, aggregateAutoScores)).toEqual(template2);
    });
  });
}

function generate() {
  describe('generate()', () => {
    it('should generate report', () => {
      const content = 'template1Content';
      const projectAchievement = {
        report: {
          locations: [
            {
              nodeId: 'node1',
              componentId: 'component1'
            }
          ],
          templates: [
            {
              id: 'template1',
              satisfyConditional: 'any',
              satisfyCriteria: [
                createSatisfyCriteria(
                  'node1',
                  'component1',
                  'ki',
                  'percentOfScoresLessThanOrEqualTo',
                  3,
                  50
                )
              ],
              content: content
            }
          ]
        }
      };
      const aggregateAutoScores = {
        ki: {
          counts: createScoreCounts([10, 10, 10, 10, 10]),
          scoreCount: 50
        }
      };
      spyOn(service, 'calculateAggregateAutoScores').and.returnValue(aggregateAutoScores);
      const report = service.generate(projectAchievement, 1);
      expect(report.content).toEqual(content);
    });
  });
}

function getCustomScoreValueCounts() {
  describe('getCustomScoreValueCounts()', () => {
    it('should get custom score value counts', () => {
      const scoreValues = service.getCustomScoreValueCounts([0, 1, 2]);
      expect(Object.entries(scoreValues).length).toEqual(3);
      expect(scoreValues[0]).toEqual(0);
      expect(scoreValues[1]).toEqual(0);
      expect(scoreValues[2]).toEqual(0);
    });
  });
}

function getPossibleScoreValueCounts() {
  describe('getPossibleScoreValueCounts()', () => {
    it('should get possible score value counts for ki', () => {
      const scoreValues = service.getPossibleScoreValueCounts('ki');
      expect(Object.entries(scoreValues).length).toEqual(5);
      expect(scoreValues[1]).toEqual(0);
      expect(scoreValues[2]).toEqual(0);
      expect(scoreValues[3]).toEqual(0);
      expect(scoreValues[4]).toEqual(0);
      expect(scoreValues[5]).toEqual(0);
    });
    it('should get possible score value counts for not ki', () => {
      const scoreValues = service.getPossibleScoreValueCounts('science');
      expect(Object.entries(scoreValues).length).toEqual(3);
      expect(scoreValues[1]).toEqual(0);
      expect(scoreValues[2]).toEqual(0);
      expect(scoreValues[3]).toEqual(0);
    });
  });
}

function processMilestoneGraphsAndData() {
  describe('processMilestoneGraphsAndData()', () => {
    it('should process milestone report graph', () => {
      let content = '<milestone-report-graph id="ki"></milestone-report-graph>';
      const componentAggregateAutoScores = [
        {
          nodeId: 'node1',
          componentId: 'component1',
          aggregateAutoScore: {
            ki: {
              scoreSum: 4,
              scoreCount: 2,
              average: 2,
              counts: createScoreCounts([1, 0, 1, 0, 0])
            }
          }
        }
      ];
      content = service.processMilestoneGraphsAndData(content, componentAggregateAutoScores);
      expect(
        content.includes(
          `data="[{` +
            `'scoreSum':4,'scoreCount':2,'average':2,'counts':{'1':1,'2':0,'3':1,'4':0,'5':0},` +
            `'nodeId':'node1','componentId':'component1'` +
            `}]"`
        )
      ).toEqual(true);
    });
  });
}

function setupAggregateSubScore() {
  describe('setupAggregateSubScore()', () => {
    it('should setup aggregate sub score', () => {
      const subScoreId = 'ki';
      const reportSettings = {};
      const counts = service.setupAggregateSubScore(subScoreId, reportSettings);
      expect(counts.scoreSum).toEqual(0);
      expect(counts.scoreCount).toEqual(0);
      expect(counts.counts).toEqual(createScoreCounts([0, 0, 0, 0, 0]));
      expect(counts.average).toEqual(0);
    });
    it('should setup aggregate sub score with custom score values', () => {
      const subScoreId = 'ki';
      const reportSettings = {
        customScoreValues: {
          ki: [0, 1, 2]
        }
      };
      const counts = service.setupAggregateSubScore(subScoreId, reportSettings);
      expect(counts.scoreSum).toEqual(0);
      expect(counts.scoreCount).toEqual(0);
      expect(counts.counts).toEqual({ 0: 0, 1: 0, 2: 0 });
      expect(counts.average).toEqual(0);
    });
  });
}
