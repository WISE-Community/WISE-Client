import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';

let service: AnnotationService;
let projectService: ProjectService;
let utilService: UtilService;
let demoProjectJSON: any;

const annotations = [
  {
    toWorkgroupId: 1,
    type: 'score',
    nodeId: 'node2',
    componentId: '7edwu1p29b',
    data: { value: 1 }
  },
  {
    toWorkgroupId: 1,
    type: 'autoScore',
    nodeId: 'node3',
    componentId: '0sef5ya2wj',
    data: { value: 2 }
  }
];

describe('AnnotationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    utilService = TestBed.inject(UtilService);
    service = TestBed.inject(AnnotationService);
    projectService = TestBed.inject(ProjectService);
    demoProjectJSON = JSON.parse(JSON.stringify(demoProjectJSON_import));
    projectService.setProject(demoProjectJSON);
  });
  getTotalScore();
});

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
    expect(service.getTotalScore(annotations)).toEqual(3);
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
    expect(service.getTotalScore(annotations)).toEqual(1);
  });
}
