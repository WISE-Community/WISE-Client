import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { copy } from '../../assets/wise5/common/object/object';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { Annotation } from '../../assets/wise5/common/Annotation';

let service: AnnotationService;
let projectService: ProjectService;
let demoProjectJSON: any;

const annotation1 = {
  toWorkgroupId: 1,
  type: 'score',
  nodeId: 'node2',
  componentId: '7edwu1p29b',
  data: { value: 1 }
};
const annotation2 = {
  toWorkgroupId: 1,
  type: 'comment',
  nodeId: 'node2',
  componentId: '7edwu1p29b',
  data: { value: 'Nice job!' }
};
const annotation3 = {
  toWorkgroupId: 1,
  type: 'autoScore',
  nodeId: 'node3',
  componentId: '0sef5ya2wj',
  data: { value: 2 }
};
const annotation4 = {
  toWorkgroupId: 1,
  type: 'autoScore',
  nodeId: 'node2',
  componentId: '7edwu1p29b',
  data: { value: 5 }
};
const annotations = [annotation1, annotation2, annotation3, annotation4];

describe('AnnotationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    service = TestBed.inject(AnnotationService);
    service.annotations = annotations as Annotation[];
    projectService = TestBed.inject(ProjectService);
    demoProjectJSON = copy(demoProjectJSON_import);
    projectService.setProject(demoProjectJSON);
  });
  getLatestScoreAnnotation();
  getTotalScore();
});

function getLatestScoreAnnotation() {
  describe('getLatestScoreAnnotation()', () => {
    getLatestScoreAnnotation_NoMatch_ReturnNull();
    getLatestScoreAnnotation_MultipleMatches_ReturnLatestAnnotation();
  });
}

function getLatestScoreAnnotation_NoMatch_ReturnNull() {
  describe('no matching annotation is found', () => {
    it('returns null', () => {
      expect(service.getLatestScoreAnnotation('nodeX', 'componentX', 10, 'any')).toBeUndefined();
    });
  });
}

function getLatestScoreAnnotation_MultipleMatches_ReturnLatestAnnotation() {
  describe('multiple annotations are found', () => {
    it('returns latest annotation', () => {
      expect(service.getLatestScoreAnnotation('node2', '7edwu1p29b', 1, 'any')).toEqual(
        annotation4 as Annotation
      );
    });
  });
}

function getTotalScore() {
  describe('getTotalScore()', () => {
    getTotalScore_noAnnotationForWorkgroup_return0();
    getTotalScore_returnSumScoresAutoScoresForWorkgroup();
    getTotalScore_omitInActiveNodes();
    getTotalScore_omitExcludFromTotalScoreNodes();
  });
}

function getTotalScore_noAnnotationForWorkgroup_return0() {
  it('should return null when no annotations for workgroup', () => {
    expect(service.getTotalScore([])).toBeNull();
  });
}

function getTotalScore_returnSumScoresAutoScoresForWorkgroup() {
  it('should return sum of annotation scores and autoscores for workgroup', () => {
    expect(service.getTotalScore(annotations)).toEqual(7);
  });
}

function getTotalScore_omitInActiveNodes() {
  it('should omit scores for inactive nodes', () => {
    projectService.project.nodes = projectService.project.nodes.filter((node) => {
      return node.id !== 'node2';
    });
    expect(service.getTotalScore(annotations)).toEqual(2);
  });
}

function getTotalScore_omitExcludFromTotalScoreNodes() {
  it('should omit scores for nodes marked as excludeFromTotalScore', () => {
    projectService.getComponent('node3', '0sef5ya2wj').excludeFromTotalScore = true;
    expect(service.getTotalScore(annotations)).toEqual(5);
  });
}
