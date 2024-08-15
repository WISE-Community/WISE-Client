import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { PeerGroupingAuthoringService } from '../../assets/wise5/services/peerGroupingAuthoringService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { PeerGrouping } from '../domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let allPeerGroupings: PeerGrouping[];
let configService: ConfigService;
let getPeerGroupingsSpy: jasmine.Spy;
let http: HttpTestingController;
const name1: string = 'Group 1';
const name2: string = 'Group 2';
const nodeId1: string = 'node1';
const nodeId2: string = 'node2';
let peerGrouping1: PeerGrouping;
let peerGrouping2: PeerGrouping;
const nodeTitle1: string = 'First Step';
const nodeTitle2: string = 'Second Step';
let projectService: TeacherProjectService;
const runId: number = 1;
let saveProjectSpy: jasmine.Spy;
let service: PeerGroupingAuthoringService;
const tag1: string = 'tag1';
const tag2: string = 'tag2';

describe('PeerGroupingAuthoringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [PeerGroupingAuthoringService, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PeerGroupingAuthoringService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    projectService = TestBed.inject(TeacherProjectService);
    peerGrouping1 = new PeerGrouping({ name: name1, tag: tag1 });
    peerGrouping2 = new PeerGrouping({ name: name2, tag: tag2 });
    allPeerGroupings = [peerGrouping1, peerGrouping2];
    getPeerGroupingsSpy = spyOn(projectService, 'getPeerGroupings').and.returnValue(
      allPeerGroupings
    );
    saveProjectSpy = spyOn(projectService, 'saveProject');
    spyOn(configService, 'getRunId').and.returnValue(runId);
    spyOn(projectService, 'getNodePositionAndTitle').and.callFake((id: string) => {
      switch (id) {
        case nodeId1:
          return nodeTitle1;
        case nodeId2:
          return nodeTitle2;
        default:
          return '';
      }
    });
  });

  getPeerGroupings();
  getPeerGrouping();
  createNewPeerGrouping();
  updatePeerGrouping();
  getStepsUsedIn();
  getUniqueTag();
  deletePeerGrouping();
});

function getPeerGroupings() {
  describe('getPeerGroupings', () => {
    it('should get peer groupings', () => {
      const peerGroupings = service.getPeerGroupings();
      expect(getPeerGroupingsSpy).toHaveBeenCalled();
      expect(peerGroupings).toEqual(allPeerGroupings);
    });
  });
}

function getPeerGrouping() {
  describe('getPeerGrouping', () => {
    it('should get peer grouping', () => {
      const peerGrouping = service.getPeerGrouping(tag2);
      expect(peerGrouping).toEqual(peerGrouping2);
    });
  });
}

function createNewPeerGrouping() {
  describe('createNewPeerGrouping', () => {
    it('should create new peer grouping', () => {
      service.createNewPeerGrouping(peerGrouping1).subscribe(() => {});
      const expectedRequest = http.expectOne(`/api/run/${runId}/peer-grouping`);
      expect(expectedRequest.request.method).toEqual('POST');
      expect(expectedRequest.request.body).toEqual(peerGrouping1);
    });
  });
}

function updatePeerGrouping() {
  describe('updatePeerGrouping', () => {
    it('should update peer grouping settings', () => {
      const newName = 'Group A';
      const peerGrouping = new PeerGrouping({ name: newName, tag: tag1 });
      expect(allPeerGroupings[0].name).toEqual(name1);
      service.updatePeerGrouping(peerGrouping);
      expect(allPeerGroupings[0].name).toEqual(newName);
      expect(saveProjectSpy).toHaveBeenCalled();
    });
  });
}

function getStepsUsedIn() {
  describe('getStepsUsedIn', () => {
    it('should get steps used in', () => {
      const step1 = createStepNode(nodeId1, [createComponent(tag1)]);
      const step2 = createStepNode(nodeId2, [createComponent(tag2)]);
      spyOn(projectService, 'getApplicationNodes').and.returnValue([step1, step2]);
      const stepsUsedIn = service.getStepsUsedIn(tag2);
      expect(stepsUsedIn).toEqual([nodeTitle2]);
    });
  });
}

function createStepNode(id: string, components: any[]): any {
  return { components: components, id: id };
}

function createComponent(tag: string): any {
  return { peerGroupingTag: tag };
}

function getUniqueTag() {
  describe('getUniqueTag', () => {
    it('should get unique tag', () => {
      const uniqueTag = service.getUniqueTag();
      expect([tag1, tag2]).not.toContain(uniqueTag);
    });
  });
}

function deletePeerGrouping() {
  describe('deletePeerGrouping', () => {
    it('should delete peer grouping', () => {
      expect(allPeerGroupings).toEqual([peerGrouping1, peerGrouping2]);
      service.deletePeerGrouping(peerGrouping2);
      expect(allPeerGroupings).toEqual([peerGrouping1]);
      expect(saveProjectSpy).toHaveBeenCalled();
    });
  });
}
