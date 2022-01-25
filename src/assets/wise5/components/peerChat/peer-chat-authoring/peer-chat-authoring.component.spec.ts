import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { Observable, Subject } from 'rxjs';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { PeerChatAuthoringComponent } from './peer-chat-authoring.component';

export class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
}

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
        MatSelectModule,
        UpgradeModule
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
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  function addLogic() {
    it('should add grouping logic', () => {
      const logic = component.authoringComponentContent.logic;
      expect(logic.length).toEqual(1);
      component.addLogic();
      expect(logic.length).toEqual(2);
    });
  }

  function deleteLogic() {
    it('should not delete grouping logic when there is only one', () => {
      const logic = component.authoringComponentContent.logic;
      expect(logic.length).toEqual(1);
      const alertSpy = spyOn(window, 'alert');
      component.deleteLogic(0);
      expect(alertSpy).toHaveBeenCalled();
      expect(logic.length).toEqual(1);
    });

    it('should ask to delete grouping logic when there is more than one', () => {
      const logic = component.authoringComponentContent.logic;
      logic.push({ name: 'random' });
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
      expect(logic.length).toEqual(2);
      component.deleteLogic(0);
      expect(confirmSpy).toHaveBeenCalled();
      expect(logic.length).toEqual(1);
    });
  }

  function logicNameChanged() {
    it('should change logic name to random', () => {
      shouldChangeLogicNameWithNoNodeIdComponentId('random');
    });

    it('should change logic name to manual', () => {
      shouldChangeLogicNameWithNoNodeIdComponentId('manual');
    });
  }

  function shouldChangeLogicNameWithNoNodeIdComponentId(logicName: string): void {
    const logicObject = component.authoringComponentContent.logic[0];
    expectLogicName(component.authoringComponentContent.logic[0], 'maximizeSimilarIdeas');
    expect(logicObject.nodeId).not.toBeNull();
    expect(logicObject.componentId).not.toBeNull();
    logicObject.name = logicName;
    component.logicNameChanged(logicObject);
    expectLogicName(component.authoringComponentContent.logic[0], logicName);
    expect(logicObject.nodeId).toBeUndefined();
    expect(logicObject.componentId).toBeUndefined();
  }

  function expectLogicName(logicObject: any, expectedName: string): void {
    expect(logicObject.name).toEqual(expectedName);
  }

  addLogic();
  deleteLogic();
  logicNameChanged();
});
