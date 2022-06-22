import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentWebSocketService } from '../../../services/studentWebSocketService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';
import { PeerChatStudentComponent } from './peer-chat-student.component';
import { PeerGroupMember } from '../PeerGroupMember';
import { of } from 'rxjs';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PeerChatModule } from '../peer-chat.module';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

export class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

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
  maxMembershipCount: 2,
  questionBank: ['What color is the sky?', 'How deep is the ocean?']
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
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        PeerChatModule,
        UpgradeModule
      ],
      declarations: [ComponentHeader, PeerChatStudentComponent, PossibleScoreComponent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        NotebookService,
        NotificationService,
        PeerChatService,
        PeerGroupService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        StudentWebSocketService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(studentWorkgroupId1);
    spyOn(TestBed.inject(ConfigService), 'getTeacherWorkgroupIds').and.returnValue([
      teacherWorkgroupId
    ]);
    spyOn(TestBed.inject(ConfigService), 'isTeacherWorkgroupId').and.callFake(
      (workgroupId: number) => {
        return workgroupId === teacherWorkgroupId;
      }
    );
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    retrievePeerGroupSpy = spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroup');
    retrievePeerGroupSpy.and.callFake(() => {
      return of(peerGroup);
    });
    spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroupWork').and.returnValue(
      of([componentState1, componentState2])
    );
    component = fixture.componentInstance;
    component.componentContent = componentContent;
    component.nodeId = nodeId;
    component.componentId = componentId;
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
  it('should create component state', () => {
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
