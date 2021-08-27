import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { Observable, Subject } from 'rxjs';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { DrawService } from '../drawService';
import { DrawAuthoring } from './draw-authoring.component';

export class MockConfigService {}

export class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
}

let component: DrawAuthoring;
let fixture: ComponentFixture<DrawAuthoring>;

describe('DrawAuthoring', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [DrawAuthoring, EditComponentPrompt],
      providers: [
        AnnotationService,
        ConfigService,
        DrawService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        TeacherProjectService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  moveAStampDown();
  moveAStampUp();
  selectTheBackgroundImage();
});

function createComponentContent() {
  return {
    id: '6ib04ymmi8',
    type: 'Draw',
    prompt: 'Draw your favorite thing.',
    showSaveButton: false,
    showSubmitButton: false,
    stamps: {
      Stamps: ['carbon.png', 'oxygen.png']
    },
    tools: {
      select: true,
      line: true,
      shape: true,
      freeHand: true,
      text: true,
      stamp: true,
      strokeColor: true,
      fillColor: true,
      clone: true,
      strokeWidth: true,
      sendBack: true,
      sendForward: true,
      undo: true,
      redo: true,
      delete: true
    },
    showAddToNotebookButton: true,
    background: 'background.png'
  };
}

function selectTheBackgroundImage() {
  it('should select the background image', () => {
    component.nodeId = 'node1';
    component.componentId = 'component1';
    expect(component.authoringComponentContent.background).toEqual('background.png');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    const args = {
      nodeId: 'node1',
      componentId: 'component1',
      target: 'background',
      targetObject: {},
      assetItem: {
        fileName: 'new_background.png'
      }
    };
    component.assetSelected(args);
    expect(component.authoringComponentContent.background).toEqual('new_background.png');
  });
}

function moveAStampUp() {
  it('should move a stamp up', () => {
    expect(component.authoringComponentContent.stamps.Stamps[0]).toEqual('carbon.png');
    expect(component.authoringComponentContent.stamps.Stamps[1]).toEqual('oxygen.png');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.moveStampUp(1);
    expect(component.authoringComponentContent.stamps.Stamps[0]).toEqual('oxygen.png');
    expect(component.authoringComponentContent.stamps.Stamps[1]).toEqual('carbon.png');
  });
}

function moveAStampDown() {
  it('should move a stamp down', () => {
    expect(component.authoringComponentContent.stamps.Stamps[0]).toEqual('carbon.png');
    expect(component.authoringComponentContent.stamps.Stamps[1]).toEqual('oxygen.png');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.moveStampDown(0);
    expect(component.authoringComponentContent.stamps.Stamps[0]).toEqual('oxygen.png');
    expect(component.authoringComponentContent.stamps.Stamps[1]).toEqual('carbon.png');
  });
}
