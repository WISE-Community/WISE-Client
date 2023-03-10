import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { StudentDataService } from '../../../services/studentDataService';
import { ScoreConstraintStrategy } from './ScoreConstraintStrategy';

let annotationService: AnnotationService;
let configService: ConfigService;
let dataService: StudentDataService;
let strategy: ScoreConstraintStrategy;

describe('ScoreConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    annotationService = TestBed.inject(AnnotationService);
    configService = TestBed.inject(ConfigService);
    dataService = TestBed.inject(StudentDataService);
    strategy = new ScoreConstraintStrategy();
    strategy.annotationService = annotationService;
    strategy.configService = configService;
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        scores: [1, 2, 3]
      }
    };
    it('should evaluate score criteria false', () => {
      scoreCriteriaSpies({}, 4);
      expect(strategy.evaluate(criteria)).toEqual(false);
    });
    it('should evaluate score criteria true', () => {
      scoreCriteriaSpies({}, 3);
      expect(strategy.evaluate(criteria)).toEqual(true);
    });
  });
}

function scoreCriteriaSpies(annotation: any, score: number): void {
  spyOn(configService, 'getWorkgroupId').and.returnValue(1);
  spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue(annotation);
  spyOn(annotationService, 'getScoreValueFromScoreAnnotation').and.returnValue(score);
}
