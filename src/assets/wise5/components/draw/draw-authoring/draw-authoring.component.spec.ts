import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MockNodeService } from '../../common/MockNodeService';
import { DrawService } from '../drawService';
import { DrawAuthoring } from './draw-authoring.component';
import { DrawAuthoringModule } from './draw-authoring.module';

export class MockConfigService {}

let component: DrawAuthoring;
let fixture: ComponentFixture<DrawAuthoring>;

const componentContent = {
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

describe('DrawAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, DrawAuthoringModule, HttpClientTestingModule],
      declarations: [],
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
    fixture = TestBed.createComponent(DrawAuthoring);
    component = fixture.componentInstance;
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
