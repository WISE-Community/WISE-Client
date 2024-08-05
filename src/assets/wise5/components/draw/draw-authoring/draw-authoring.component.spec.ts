import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { DrawAuthoring } from './draw-authoring.component';
import { DrawAuthoringModule } from './draw-authoring.module';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

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
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(DrawAuthoring);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });
  moveAStampDown();
  moveAStampUp();
});

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
