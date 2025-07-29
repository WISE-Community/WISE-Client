import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { MockNodeService } from '../../common/MockNodeService';
import { PeerChatAuthoringComponent } from './peer-chat-authoring.component';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';

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
      imports: [PeerChatAuthoringComponent, StudentTeacherCommonServicesModule],
      providers: [
        ConfigService,
        { provide: TeacherNodeService, useClass: MockNodeService },
        PeerGroupingAuthoringService,
        ProjectAssetService,
        ProjectService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(PeerChatAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1',
      'node2',
      'node3'
    ]);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(copy(componentContent));
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGroupings').and.returnValue([]);
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
