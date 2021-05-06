import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { UtilService } from '../../assets/wise5/services/utilService';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';

let service: AnnotationService;
let projectService: ProjectService;
let utilService: UtilService;
let demoProjectJSON: any;
const WORKGROUP_1 = 1;
const WORKGROUP_2 = 2;
const WORKGROUP_3 = 3;

const annotations = [
  {
    toWorkgroupId: WORKGROUP_1,
    type: 'score',
    nodeId: 'node2',
    componentId: '7edwu1p29b',
    data: { value: 3 }
  },
  {
    toWorkgroupId: WORKGROUP_2,
    type: 'score',
    nodeId: 'node2',
    componentId: '7edwu1p29b',
    data: { value: 1 }
  },
  {
    toWorkgroupId: WORKGROUP_1,
    type: 'autoScore',
    nodeId: 'node3',
    componentId: '0sef5ya2wj',
    data: { value: 2 }
  }
];

describe('AnnotationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [ProjectService, ConfigService, SessionService, AnnotationService, UtilService]
    });
    utilService = TestBed.inject(UtilService);
    spyOn(utilService, 'broadcastEventInRootScope').and.callFake(() => {});
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
    expect(service.getTotalScoreForWorkgroup([], WORKGROUP_1)).toBeNull();
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_3)).toBeNull();
  });
}

function getTotalScore_returnSumScoresAutoScoresForWorkgroup() {
  it('should return sum of annotation scores and autoscores for workgroup', () => {
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_1)).toEqual(5);
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_2)).toEqual(1);
  });
}

function getTotalScore_omitInActiveNodes() {
  it('should omit scores for inactive nodes', () => {
    projectService.project.nodes = projectService.project.nodes.filter((node) => {
      return node.id !== 'node2';
    });
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_1)).toEqual(2);
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_2)).toBeNull();
  });
}

function getTotalScore_omitExcludFromTotalScoreNodes() {
  it('should omit scores for nodes marked as excludeFromTotalScore', () => {
    projectService.getComponentByNodeIdAndComponentId(
      'node3',
      '0sef5ya2wj'
    ).excludeFromTotalScore = true;
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_1)).toEqual(3);
    expect(service.getTotalScoreForWorkgroup(annotations, WORKGROUP_2)).toEqual(1);
  });
}
