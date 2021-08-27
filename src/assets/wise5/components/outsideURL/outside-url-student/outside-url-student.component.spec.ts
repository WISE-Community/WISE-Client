import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { AnnotationService } from '../../../services/annotationService';
import { AudioRecorderService } from '../../../services/audioRecorderService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { OutsideURLService } from '../outsideURLService';
import { OutsideUrlStudent } from './outside-url-student.component';

class MockNotebookService {
  addNote() {}
}
class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

let component: OutsideUrlStudent;
const componentId = 'component1';
let fixture: ComponentFixture<OutsideUrlStudent>;
const nodeId = 'node1';

describe('OutsideUrlStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [OutsideUrlStudent],
      providers: [
        AnnotationService,
        AudioRecorderService,
        ComponentService,
        ConfigService,
        CRaterService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockNotebookService },
        NotificationService,
        OutsideURLService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideUrlStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      id: componentId,
      height: 600,
      width: 800,
      url: 'https://www.berkeley.edu'
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  getHeight();
  getWidth();
});

function getWidth() {
  it('should get width', () => {
    expect(component.getWidth(component.componentContent)).toEqual('800px');
  });
}

function getHeight() {
  it('should get height', () => {
    expect(component.getHeight(component.componentContent)).toEqual('600px');
  });
}
