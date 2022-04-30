import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { PeerGroupingSettings } from '../../assets/wise5/authoringTool/peer-grouping/peerGroupingSettings';
import { ConfigService } from '../../assets/wise5/services/configService';
import { PeerGroupingAuthoringService } from '../../assets/wise5/services/peerGroupingAuthoringService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../assets/wise5/services/utilService';

let allPeerGroupingSettings: PeerGroupingSettings[];
let configService: ConfigService;
let getPeerGroupingSettingsSpy: jasmine.Spy;
let http: HttpTestingController;
const name1: string = 'Group 1';
const name2: string = 'Group 2';
const nodeId1: string = 'node1';
const nodeId2: string = 'node2';
let peerGroupingSettings1: PeerGroupingSettings;
let peerGroupingSettings2: PeerGroupingSettings;
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
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        ConfigService,
        PeerGroupingAuthoringService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    });
    service = TestBed.inject(PeerGroupingAuthoringService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    projectService = TestBed.inject(TeacherProjectService);
    peerGroupingSettings1 = new PeerGroupingSettings({ name: name1, tag: tag1 });
    peerGroupingSettings2 = new PeerGroupingSettings({ name: name2, tag: tag2 });
    allPeerGroupingSettings = [peerGroupingSettings1, peerGroupingSettings2];
    getPeerGroupingSettingsSpy = spyOn(projectService, 'getPeerGroupingSettings').and.returnValue(
      allPeerGroupingSettings
    );
    saveProjectSpy = spyOn(projectService, 'saveProject');
    spyOn(configService, 'getRunId').and.returnValue(runId);
    spyOn(projectService, 'getNodePositionAndTitleByNodeId').and.callFake((id: string) => {
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

  getPeerGroupingSettings();
  createNewPeerGroupingSettings();
  updatePeerGroupingSettings();
  getStepsUsedIn();
  getUniqueTag();
  deletePeerGroupingSettings();
  getPeerGroupingSettingsName();
});

function getPeerGroupingSettings() {
  describe('getPeerGroupingSettings', () => {
    it('should get peer grouping settings', () => {
      const peerGroupingSettingsResult = service.getPeerGroupingSettings();
      expect(getPeerGroupingSettingsSpy).toHaveBeenCalled();
      expect(peerGroupingSettingsResult).toEqual(allPeerGroupingSettings);
    });
  });
}

function createNewPeerGroupingSettings() {
  describe('createNewPeerGroupingSettings', () => {
    it('should create new peer grouping settings', () => {
      service.createNewPeerGroupingSettings(peerGroupingSettings1).subscribe(() => {});
      const expectedRequest = http.expectOne(`/api/run/${runId}/peer-group-settings`);
      expect(expectedRequest.request.method).toEqual('POST');
      expect(expectedRequest.request.body).toEqual(peerGroupingSettings1);
    });
  });
}

function updatePeerGroupingSettings() {
  describe('updatePeerGroupingSettings', () => {
    it('should update peer grouping settings', () => {
      const newName = 'Group A';
      const peerGroupingSettings = new PeerGroupingSettings({ name: newName, tag: tag1 });
      expect(allPeerGroupingSettings[0].name).toEqual(name1);
      service.updatePeerGroupingSettings(peerGroupingSettings);
      expect(allPeerGroupingSettings[0].name).toEqual(newName);
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

function deletePeerGroupingSettings() {
  describe('deletePeerGroupingSettings', () => {
    it('should delete peer grouping settings', () => {
      expect(allPeerGroupingSettings.length).toEqual(2);
      service.deletePeerGroupingSettings(tag2);
      expect(allPeerGroupingSettings.length).toEqual(1);
      expect(allPeerGroupingSettings[0].tag).toEqual(tag1);
      expect(saveProjectSpy).toHaveBeenCalled();
    });
  });
}

function getPeerGroupingSettingsName() {
  describe('getPeerGroupingSettingsName', () => {
    it('should get peer grouping settings name', () => {
      expect(service.getPeerGroupingSettingsName(tag1)).toEqual(name1);
      expect(service.getPeerGroupingSettingsName(tag2)).toEqual(name2);
    });
  });
}
