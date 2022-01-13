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
import { ShowPeerGroupWorkStudentComponent } from './show-peer-group-work-student.component';

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
}

describe('ShowPeerGroupWorkStudentComponent', () => {
  let component: ShowPeerGroupWorkStudentComponent;
  let fixture: ComponentFixture<ShowPeerGroupWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [ShowPeerGroupWorkStudentComponent],
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
    fixture = TestBed.createComponent(ShowPeerGroupWorkStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
