import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { MockService } from '../../animation/animation-student/animation-student.component.spec';
import { ComponentService } from '../../componentService';
import { PeerGroup } from '../../peerChat/PeerGroup';
import { PeerGroupActivity } from '../../peerChat/PeerGroupActivity';
import { PeerGroupMember } from '../../peerChat/PeerGroupMember';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

class MockNotebookService {
  isNotebookEnabled() {
    return false;
  }
}

class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

class MockConfigService {
  getRunId() {
    return 1;
  }
  isPreview() {
    return false;
  }
  getWorkgroupId() {
    return 1;
  }
  getAvatarColorForWorkgroupId(workgroupId: any) {
    return '#000000';
  }
  getUsernamesStringByWorkgroupId(workgroupId: number) {
    return `Student ${workgroupId}`;
  }
}

let component: ShowGroupWorkStudentComponent;
let componentState1;
let componentState2;
let componentState3;
let fixture: ComponentFixture<ShowGroupWorkStudentComponent>;
let studentWork;

describe('ShowGroupWorkStudentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [ShowGroupWorkStudentComponent],
      providers: [
        AnnotationService,
        { provide: ComponentService, useClass: MockService },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: MatDialog, useClass: MockService },
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockNotebookService },
        PeerGroupService,
        ProjectService,
        SessionService,
        { provide: StudentAssetService, useClass: MockService },
        StudentDataService,
        TagService,
        { provide: UtilService, useClass: MockService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGroupWorkStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    componentState1 = createComponentState(1);
    componentState2 = createComponentState(2);
    studentWork = [componentState1, componentState2];
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true,
      isShowMyWork: true,
      layout: 'row'
    };
    spyOn(TestBed.inject(ProjectService), 'injectAssetPaths').and.returnValue({
      type: 'OpenResponse'
    });
    component.peerGroup = new PeerGroup(
      1,
      [new PeerGroupMember(1, 1), new PeerGroupMember(2, 1), new PeerGroupMember(3, 1)],
      new PeerGroupActivity()
    );
    component.setWorkgroupInfos();
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  setStudentWorkFromGroupMembers();
  setLayout();
  setWidths();
});

function createComponentState(workgroupId: number): any {
  return {
    workgroupId: workgroupId
  };
}

function setStudentWorkFromGroupMembers() {
  describe('setStudentWorkFromGroupMembers', () => {
    it('should add entry to workgroupIdToWork for each student work', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.workgroupIdToWork.size).toEqual(2);
    });
  });
}

function setLayout() {
  describe('setLayout', () => {
    it('should set row layout for narrow component type', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      component.setLayout();
      expect(component.flexLayout).toBe('row wrap');
    });

    it('should set column layout', () => {
      component.componentContent.layout = 'column';
      component.setStudentWorkFromGroupMembers(studentWork);
      component.setLayout();
      expect(component.flexLayout).toBe('column');
    });
  });
}

function setWidths() {
  describe('setWidths()', () => {
    it('should set widths for narrow component type including my work', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      component.setWidths();
      expect(component.widthMd).toEqual(50);
      expect(component.widthLg).toEqual(33.33);
    });

    it('should set widths for narrow component type not including my work', () => {
      component.componentContent.isShowMyWork = false;
      spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(1);
      component.setStudentWorkFromGroupMembers(studentWork);
      component.setWidths();
      expect(component.widthMd).toEqual(50);
      expect(component.widthLg).toEqual(33.33);
    });

    it('should set widths for narrow component type and more than 2 group members', () => {
      componentState3 = createComponentState(3);
      studentWork = [componentState1, componentState2, componentState3];
      component.setStudentWorkFromGroupMembers(studentWork);
      component.setWidths();
      expect(component.widthMd).toEqual(50);
      expect(component.widthLg).toEqual(33.33);
    });
  });
}
