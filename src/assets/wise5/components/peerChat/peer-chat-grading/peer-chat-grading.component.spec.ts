import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { PeerChatService } from '../peerChatService';
import { PeerChatGradingComponent } from './peer-chat-grading.component';

const componentContent = {
  id: 'qn3savv52r',
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
  questionBank: ['What color is the sky?', 'How deep is the ocean?'],
  showWorkNodeId: 'node8',
  showWorkComponentId: 'vau6ihimfk',
  secondPrompt: 'Discuss. Use the Question Bank.'
};
describe('PeerChatGradingComponent', () => {
  let component: PeerChatGradingComponent;
  let fixture: ComponentFixture<PeerChatGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [PeerChatGradingComponent],
      providers: [
        AnnotationService,
        ConfigService,
        PeerChatService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatGradingComponent);
    component = fixture.componentInstance;
    component.componentContent = componentContent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
