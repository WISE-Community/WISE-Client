import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { MockNodeService } from '../../common/MockNodeService';
import { PeerChatAuthoringComponent } from './peer-chat-authoring.component';

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
  showWorkNodeId: 'node8',
  showWorkComponentId: 'vau6ihimfk'
};

describe('PeerChatAuthoringComponent', () => {
  let component: PeerChatAuthoringComponent;
  let fixture: ComponentFixture<PeerChatAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule
      ],
      declarations: [EditComponentPrompt, PeerChatAuthoringComponent],
      providers: [
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1',
      'node2',
      'node3'
    ]);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });
});
