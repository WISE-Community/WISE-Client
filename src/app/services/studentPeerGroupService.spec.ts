import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PeerGroup } from '../../assets/wise5/components/peerChat/PeerGroup';
import { PeerGroupMember } from '../../assets/wise5/components/peerChat/PeerGroupMember';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { StudentPeerGroupService } from '../../assets/wise5/services/studentPeerGroupService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

let annotationService: AnnotationService;
const componentId1 = 'component1';
let configService: ConfigService;
const dummyAnnotation = { id: 200, data: {} };
const dummyStudentData = { id: 100, studentData: {} };
let http: HttpClient;
const nodeId1 = 'node1';
const peerGroupId1 = 1;
const peerGroupingTag1 = 'peerGroupingTag1';
const periodId1 = 10;
let projectService: ProjectService;
const runId1 = 100;
let service: StudentPeerGroupService;
let studentDataService: StudentDataService;
const workgroupId1 = 1000;

const peerGroup1 = new PeerGroup(
  peerGroupId1,
  [new PeerGroupMember(workgroupId1, periodId1)],
  null
);

describe('StudentPeerGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    annotationService = TestBed.inject(AnnotationService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(StudentPeerGroupService);
    studentDataService = TestBed.inject(StudentDataService);
    spyOn(configService, 'getWorkgroupId').and.returnValue(workgroupId1);
    spyOn(configService, 'getPeriodId').and.returnValue(periodId1);
    spyOn(configService, 'getRunId').and.returnValue(runId1);
  });
  retrievePeerGroup();
  retrievePeerGroupWork();
  retrieveQuestionBankStudentData();
  retrieveDynamicPromptStudentData();
  retrievePeerGroupAnnotations();
});

function setIsPreview(isPreview: boolean) {
  spyOn(configService, 'isPreview').and.returnValue(isPreview);
}

function spyOnHttpGetAndReturnObservableOfValue(value: any) {
  return spyOn(http, 'get').and.returnValue(of(value));
}

function retrievePeerGroup() {
  describe('retrievePeerGroup()', () => {
    it('should retrieve peer group in preview', () => {
      setIsPreview(true);
      retrieveAndExpectDummyPeerGroup();
    });

    it('should retrieve peer group for teacher preview', () => {
      setIsPreview(false);
      retrieveAndExpectDummyPeerGroup();
    });

    it('should retrieve peer group from api', () => {
      setIsPreview(false);
      const httpGetSpy = spyOnHttpGetAndReturnObservableOfValue(peerGroup1);
      service.retrievePeerGroup(peerGroupingTag1, workgroupId1).subscribe(() => {
        expect(httpGetSpy).toHaveBeenCalledWith(
          `/api/peer-group/${runId1}/${workgroupId1}/${peerGroupingTag1}`
        );
      });
    });
  });
}

function retrieveAndExpectDummyPeerGroup() {
  service.retrievePeerGroup(peerGroupingTag1, workgroupId1).subscribe((peerGroup: PeerGroup) => {
    expect(peerGroup.id).toEqual(StudentPeerGroupService.PREVIEW_PEER_GROUP_ID);
    expect(peerGroup.members.length).toEqual(1);
    expect(peerGroup.members[0].id).toEqual(workgroupId1);
    expect(peerGroup.members[0].periodId).toEqual(periodId1);
  });
}

function retrievePeerGroupWork() {
  describe('retrievePeerGroupWork()', () => {
    it('should retrieve peer group work in preview', () => {
      setIsPreview(true);
      spyOn(studentDataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue([
        dummyStudentData
      ]);
      service
        .retrievePeerGroupWork(peerGroup1, nodeId1, componentId1)
        .subscribe((peerGroupWork) => {
          expect(peerGroupWork.length).toEqual(1);
          expect(peerGroupWork).toEqual([dummyStudentData]);
        });
    });

    it('should retrieve peer group work for teacher preview', () => {
      setIsPreview(false);
      service
        .retrievePeerGroupWork(peerGroup1, nodeId1, componentId1)
        .subscribe((peerGroupWork) => {
          expect(peerGroupWork.length).toEqual(0);
        });
    });

    it('should retrieve peer group work from api', () => {
      setIsPreview(false);
      const httpGetSpy = spyOnHttpGetAndReturnObservableOfValue(dummyStudentData);
      service.retrievePeerGroupWork(peerGroup1, nodeId1, componentId1).subscribe(() => {
        expect(httpGetSpy).toHaveBeenCalledWith(
          `/api/peer-group/${peerGroup1.id}/${nodeId1}/${componentId1}/student-work`
        );
      });
    });
  });
}

function retrieveQuestionBankStudentData() {
  describe('retrieveQuestionBankStudentData()', () => {
    it('should retrieve question bank student data in preview', () => {
      setIsPreview(true);
      spyOn(projectService, 'getReferenceComponentForField').and.returnValue({
        nodeId: nodeId1,
        componentId: componentId1
      });
      spyOn(studentDataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
        dummyStudentData
      );
      spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue(dummyAnnotation);
      service
        .retrieveQuestionBankStudentData(peerGroup1.id, nodeId1, componentId1)
        .subscribe((peerGroupStudentData) => {
          expect(peerGroupStudentData.length).toEqual(1);
          expect(peerGroupStudentData[0].workgroup.id).toEqual(workgroupId1);
          expect(peerGroupStudentData[0].workgroup.periodId).toEqual(periodId1);
          expect(peerGroupStudentData[0].studentWork).toEqual(dummyStudentData);
          expect(peerGroupStudentData[0].annotation).toEqual(dummyAnnotation);
        });
    });

    it('should retrieve question bank student data for teacher preview', () => {
      setIsPreview(false);
      service
        .retrieveQuestionBankStudentData(peerGroup1.id, nodeId1, componentId1)
        .subscribe((peerGroupStudentData) => {
          expect(peerGroupStudentData.length).toEqual(0);
        });
    });

    it('should retrieve question bank student data from api', () => {
      setIsPreview(false);
      const httpGetSpy = spyOnHttpGetAndReturnObservableOfValue(dummyStudentData);
      service
        .retrieveQuestionBankStudentData(peerGroup1.id, nodeId1, componentId1)
        .subscribe(() => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `/api/peer-group/${peerGroup1.id}/${nodeId1}/${componentId1}/student-data/question-bank`
          );
        });
    });
  });
}

function retrieveDynamicPromptStudentData() {
  describe('retrieveDynamicPromptStudentData()', () => {
    it('should retrieve dynamic prompt student data from api', () => {
      setIsPreview(false);
      const httpGetSpy = spyOnHttpGetAndReturnObservableOfValue(dummyStudentData);
      service
        .retrieveDynamicPromptStudentData(peerGroup1.id, nodeId1, componentId1)
        .subscribe(() => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `/api/peer-group/${peerGroup1.id}/${nodeId1}/${componentId1}/student-data/dynamic-prompt`
          );
        });
    });
  });
}

function retrievePeerGroupAnnotations() {
  describe('retrievePeerGroupAnnotations()', () => {
    it('should retrieve peer group annotations in preview and return empty array', () => {
      setIsPreview(true);
      service.retrievePeerGroupAnnotations(peerGroup1, nodeId1, componentId1);
    });

    it('should retrieve peer group annotations from api request and get annotations array', () => {
      setIsPreview(false);
      const annotations = [
        createAnnotation(workgroupId1, 'Delete'),
        createAnnotation(workgroupId1, 'Undo Delete')
      ];
      const httpGetSpy = spyOnHttpGetAndReturnObservableOfValue(annotations);
      service
        .retrievePeerGroupAnnotations(peerGroup1, nodeId1, componentId1)
        .subscribe((result) => {
          expect(result).toEqual(annotations);
        });
      expect(httpGetSpy).toHaveBeenCalledWith(
        `/api/peer-group/${peerGroup1.id}/${nodeId1}/${componentId1}/annotations`
      );
    });
  });
}

function createAnnotation(toWorkgroupId: number, action: string): any {
  return {
    componentId: componentId1,
    data: { action: action },
    nodeId: nodeId1,
    toWorkgroupId: toWorkgroupId
  };
}
