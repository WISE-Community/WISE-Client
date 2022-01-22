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

describe('ShowGroupWorkStudentComponent', () => {
  let component: ShowGroupWorkStudentComponent;
  let componentState1;
  let componentState2;
  let fixture: ComponentFixture<ShowGroupWorkStudentComponent>;

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
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  function createComponentState(workgroupId: number): any {
    return {
      workgroupId: workgroupId
    };
  }

  it('should set student work from group members including my work', () => {
    component.componentContent.isShowMyWork = true;
    const studentWork = [componentState1, componentState2];
    component.studentWorkFromGroupMembers = [];
    component.setStudentWorkFromGroupMembers(studentWork);
    expect(component.studentWorkFromGroupMembers.length).toEqual(2);
    expect(Object.keys(component.workgroupInfos).length).toEqual(2);
  });

  it('should set student work from group members not including my work', () => {
    component.componentContent.isShowMyWork = false;
    const studentWork = [componentState1, componentState2];
    component.studentWorkFromGroupMembers = [];
    spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(1);
    component.setStudentWorkFromGroupMembers(studentWork);
    expect(component.studentWorkFromGroupMembers.length).toEqual(1);
    expect(Object.keys(component.workgroupInfos).length).toEqual(1);
  });
});
