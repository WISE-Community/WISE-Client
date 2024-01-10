import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { StudentDataService } from '../../../services/studentDataService';
import { ScoreConstraintStrategy } from './ScoreConstraintStrategy';
import { Annotation } from '../../Annotation';

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
    it('should return false when score is not found in the criteria', () => {
      expectEvaluate(criteria, 4, false);
    });
    it('should return true when score is found in the criteria', () => {
      expectEvaluate(criteria, 3, true);
    });
  });
}

function expectEvaluate(criteria: any, score: number, expected: boolean): void {
  spyOn(configService, 'getWorkgroupId').and.returnValue(1);
  spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue({} as Annotation);
  spyOn(annotationService, 'getScoreValueFromScoreAnnotation').and.returnValue(score);
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
