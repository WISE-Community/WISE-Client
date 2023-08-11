import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { PeerGroup } from '../../peerChat/PeerGroup';
import { PeerGroupMember } from '../../peerChat/PeerGroupMember';
import { ShowGroupWorkDisplayComponent } from './show-group-work-display.component';

class MockService {}

class MockNotebookService {
  notebookUpdated$: any = of({});

  isNotebookEnabled() {
    return false;
  }
}

class MockConfigService {
  getPeriodId() {
    return periodId;
  }
  getRunId() {
    return 1;
  }
  isAuthoring() {
    return false;
  }
  isPreview() {
    return false;
  }
  isSignedInUserATeacher() {
    return false;
  }
  getWorkgroupId() {
    return workgroupId;
  }
  getUsernamesStringByWorkgroupId(workgroupId: number) {
    return `Student ${workgroupId}`;
  }
}

let component: ShowGroupWorkDisplayComponent;
let componentState1;
let componentState2;
let componentState3;
let fixture: ComponentFixture<ShowGroupWorkDisplayComponent>;
const periodId = 100;
const peerGroup = new PeerGroup(
  1,
  [new PeerGroupMember(1, 1), new PeerGroupMember(2, 1), new PeerGroupMember(3, 1)],
  new PeerGrouping()
);
let studentWork;
const workgroupId: number = 1000;

describe('ShowGroupWorkDisplayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [ShowGroupWorkDisplayComponent],
      providers: [
        AnnotationService,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: MatDialog, useClass: MockService },
        { provide: NodeService, useClass: MockService },
        { provide: NotebookService, useClass: MockNotebookService },
        { provide: PeerGroupService, useClass: PeerGroupService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowGroupWorkDisplayComponent);
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
      layout: 'row',
      type: 'ShowGroupWork'
    };
    spyOn(TestBed.inject(ProjectService), 'injectAssetPaths').and.returnValue({
      type: 'OpenResponse'
    });
    component.peerGroup = peerGroup;
    component.setWorkgroupInfos();
    fixture.detectChanges();
  });

  setStudentWorkFromGroupMembers();
  setLayout();
  setWidths();
  showGroupWorkInPreview();
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

function showGroupWorkInPreview() {
  describe('ngOnInit()', () => {
    it('should show group work in preview', () => {
      spyOn(TestBed.inject(ConfigService), 'isPreview').and.returnValue(true);
      spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(workgroupId);
      spyOn(TestBed.inject(ConfigService), 'getPeriodId').and.returnValue(periodId);
      spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroup').and.returnValue(of(peerGroup));
      const latestComponentState = {
        id: 100,
        studentData: {
          response: 'Hello'
        },
        workgroupId: workgroupId
      };
      spyOn(TestBed.inject(PeerGroupService), 'retrieveStudentWork').and.returnValue(
        of([latestComponentState])
      );
      component.ngOnInit();
      expect(component.workgroupIdToWork.get(workgroupId)).toEqual(latestComponentState);
    });
  });
}
