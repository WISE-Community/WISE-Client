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
    component.studentWorkFromGroupMembers = [];
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  setStudentWork();
  setLayout();
  setWidths();
});

function createComponentState(workgroupId: number): any {
  return {
    workgroupId: workgroupId
  };
}

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work from group members including my work', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.studentWorkFromGroupMembers.length).toEqual(2);
      expect(Object.keys(component.workgroupInfos).length).toEqual(2);
    });

    it('should set student work from group members not including my work', () => {
      component.componentContent.isShowMyWork = false;
      spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(1);
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.studentWorkFromGroupMembers.length).toEqual(1);
      expect(Object.keys(component.workgroupInfos).length).toEqual(1);
    });
  });
}

function setLayout() {
  describe('setLayout', () => {
    it('should set row layout for narrow component type', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.flexLayout).toBe('row wrap');
    });

    it('should set column layout', () => {
      component.componentContent.layout = 'column';
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.flexLayout).toBe('column');
    });
  });
}

function setWidths() {
  describe('setWidths()', () => {
    it('should set widths for narrow component type including my work', () => {
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.widthMd).toEqual(50);
      expect(component.widthLg).toEqual(50);
    });

    it('should set widths for narrow component type not including my work', () => {
      component.componentContent.isShowMyWork = false;
      spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(1);
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.widthMd).toEqual(100);
      expect(component.widthLg).toEqual(100);
    });

    it('should set widths for narrow component type and more than 2 group members', () => {
      componentState3 = createComponentState(3);
      studentWork = [componentState1, componentState2, componentState3];
      component.setStudentWorkFromGroupMembers(studentWork);
      expect(component.widthMd).toEqual(50);
      expect(component.widthLg).toEqual(33.33);
    });
  });
}
