import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { DrawAuthoring } from './draw-authoring.component';
import { DrawAuthoringModule } from './draw-authoring.module';

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
      imports: [
        BrowserAnimationsModule,
        DrawAuthoringModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ]
    });
    fixture = TestBed.createComponent(DrawAuthoring);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
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
    expect(component.componentContent.background).toEqual('background.png');
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
    expect(component.componentContent.background).toEqual('new_background.png');
  });
}

function moveAStampUp() {
  it('should move a stamp up', () => {
    expect(component.componentContent.stamps.Stamps[0]).toEqual('carbon.png');
    expect(component.componentContent.stamps.Stamps[1]).toEqual('oxygen.png');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.moveStampUp(1);
    expect(component.componentContent.stamps.Stamps[0]).toEqual('oxygen.png');
    expect(component.componentContent.stamps.Stamps[1]).toEqual('carbon.png');
  });
}

function moveAStampDown() {
  it('should move a stamp down', () => {
    expect(component.componentContent.stamps.Stamps[0]).toEqual('carbon.png');
    expect(component.componentContent.stamps.Stamps[1]).toEqual('oxygen.png');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.moveStampDown(0);
    expect(component.componentContent.stamps.Stamps[0]).toEqual('oxygen.png');
    expect(component.componentContent.stamps.Stamps[1]).toEqual('carbon.png');
  });
}
