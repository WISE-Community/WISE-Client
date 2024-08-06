import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentWebSocketService } from '../../../services/studentWebSocketService';
import { TagService } from '../../../services/tagService';
import { ComponentService } from '../../componentService';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';
import { PeerChatStudentComponent } from './peer-chat-student.component';
import { PeerGroupMember } from '../PeerGroupMember';
import { of } from 'rxjs';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PeerChatModule } from '../peer-chat.module';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PauseScreenService } from '../../../services/pauseScreenService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { PeerChatComponent } from '../PeerChatComponent';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: PeerChatStudentComponent;
const componentId = 'component1';
let fixture: ComponentFixture<PeerChatStudentComponent>;
const nodeId = 'node1';
const peerGroupId = 100;
const periodId = 10;
const response1 = 'Hello World';
const response2 = 'Hello World 2';
let retrievePeerGroupSpy: jasmine.Spy;
const studentWorkgroupId1 = 1001;
const studentWorkgroupId2 = 1002;
const studentWorkgroupId3 = 1003;
const teacherWorkgroupId = 1;

const componentContent = {
  id: componentId,
  type: 'PeerChat',
  prompt: 'You were paired together based on your responses.',
  showSaveButton: false,
  showSubmitButton: false,
  logic: [
    {
      name: 'maximizeSimilarIdeas',
      nodeId: 'node8',
      componentId: 'vau6ihimfk'
    }
  ],
  logicThresholdCount: 0,
  logicThresholdPercent: 0,
  maxMembershipCount: 2
};

class ComponentState {
  nodeId: string;
  componentId: string;
  peerGroupId: number;
  studentData: {
    response: string;
  };
  workgroupId: number;

  constructor(
    nodeId: string,
    componentId: string,
    peerGroupId: number,
    workgroupId: number,
    response: string
  ) {
    this.nodeId = nodeId;
    this.componentId = componentId;
    this.peerGroupId = peerGroupId;
    this.studentData = { response: response };
    this.workgroupId = workgroupId;
  }
}

const componentState1 = new ComponentState(
  nodeId,
  componentId,
  peerGroupId,
  studentWorkgroupId1,
  response1
);

const componentState2 = new ComponentState(
  nodeId,
  componentId,
  peerGroupId,
  studentWorkgroupId2,
  response2
);

const peerGroup = new PeerGroup(
  peerGroupId,
  [
    new PeerGroupMember(studentWorkgroupId1, periodId),
    new PeerGroupMember(studentWorkgroupId2, periodId)
  ],
  new PeerGrouping()
);

describe('PeerChatStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [PeerChatStudentComponent],
    imports: [BrowserAnimationsModule,
        ComponentHeaderComponent,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        PeerChatModule,
        StudentTeacherCommonServicesModule],
    providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        NotebookService,
        NotificationService,
        PauseScreenService,
        PeerChatService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        StudentWebSocketService,
        TagService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatStudentComponent);
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getWorkgroupId').and.returnValue(studentWorkgroupId1);
    spyOn(configService, 'getTeacherWorkgroupIds').and.returnValue([teacherWorkgroupId]);
    spyOn(configService, 'isTeacherWorkgroupId').and.callFake((workgroupId: number) => {
      return workgroupId === teacherWorkgroupId;
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    retrievePeerGroupSpy = spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroup');
    retrievePeerGroupSpy.and.callFake(() => {
      return of(peerGroup);
    });
    spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroupWork').and.returnValue(
      of([componentState1, componentState2])
    );
    spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroupAnnotations').and.returnValue(of([]));
    component = fixture.componentInstance;
    component.component = new PeerChatComponent(componentContent, nodeId);
    component.workgroupId = studentWorkgroupId1;
    component.peerGroup = peerGroup;
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  ngOnInit();
  addPeerChatMessage();
  submitStudentResponse();
  createComponentState();
});

function ngOnInit() {
  it('should initialize peer chat group and peer chat messages', fakeAsync(() => {
    expect(component.peerGroup).toEqual(peerGroup);
    expect(component.peerChatMessages.length).toEqual(2);
    expect(component.peerChatMessages[0].text).toEqual(response1);
    expect(component.peerChatMessages[1].text).toEqual(response2);
  }));
}

function addPeerChatMessage() {
  it(`should receive student work for the Peer Chat component and add it to peer chat
      messages`, () => {
    component.peerChatMessages = [];
    TestBed.inject(StudentDataService).broadcastStudentWorkReceived(componentState2);
    expect(component.peerChatMessages.length).toEqual(1);
    expect(component.peerChatMessages[0].text).toEqual(response2);
  });

  it(`should receive student work for the Peer Chat component and not add it to peer chat
      messages`, () => {
    component.peerChatMessages = [];
    TestBed.inject(StudentDataService).broadcastStudentWorkReceived(componentState1);
    expect(component.peerChatMessages.length).toEqual(0);
  });
}

function submitStudentResponse() {
  it('should submit student response', () => {
    component.peerChatMessages = [];
    component.submitStudentResponse(response1);
    expect(component.peerChatMessages.length).toEqual(1);
    expect(component.peerChatMessages[0].text).toEqual(response1);
  });
}

function createComponentState() {
  createComponentState_WithoutDynamicPrompt_ShouldCreateComponentState();
  createComponentState_WithDynamicPrompt_ShouldCreateComponentState();
}

function createComponentState_WithoutDynamicPrompt_ShouldCreateComponentState() {
  it('should create component state when component does not have dynamic prompt', () => {
    component.peerChatWorkgroupIds = [
      studentWorkgroupId1,
      studentWorkgroupId2,
      studentWorkgroupId3
    ];
    const sendMessageToClassmateSpy = spyOn(
      TestBed.inject(StudentWebSocketService),
      'sendStudentWorkToClassmate'
    );
    const saveNotificationToServerSpy = spyOn(
      TestBed.inject(NotificationService),
      'saveNotificationToServer'
    );
    component.createComponentState('submit').then(() => {
      expect(sendMessageToClassmateSpy).toHaveBeenCalledTimes(2);
      expect(saveNotificationToServerSpy).toHaveBeenCalledTimes(2);
    });
  });
}

function createComponentState_WithDynamicPrompt_ShouldCreateComponentState() {
  it('should create component state when component has dynamic prompt', () => {
    spyOn(
      TestBed.inject(StudentWebSocketService),
      'sendStudentWorkToClassmate'
    ).and.callFake(() => {});
    spyOn(TestBed.inject(NotificationService), 'saveNotificationToServer').and.callFake(() => {
      return Promise.resolve({});
    });
    const dynamicPrompt = new FeedbackRule({
      id: 'abcde12345',
      expression: '2',
      prompt: 'You got idea 2'
    });
    component.dynamicPrompt = dynamicPrompt;
    component.createComponentState('save').then((componentState) => {
      expect(componentState.studentData.dynamicPrompt).toEqual(dynamicPrompt);
    });
  });
}
