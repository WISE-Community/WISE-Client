import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedAuthoring } from './embedded-authoring.component';
import { EmbeddedAuthoringModule } from './embedded-authoring.module';

let component: EmbeddedAuthoring;
let fixture: ComponentFixture<EmbeddedAuthoring>;

describe('EmbeddedAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EmbeddedAuthoringModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ]
    });
    fixture = TestBed.createComponent(EmbeddedAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  shouldSelectTheModelFile();
});

function createComponentContent() {
  return {
    id: '86fel4wjm4',
    type: 'Embedded',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    url: 'glucose.html',
    showAddToNotebookButton: true,
    width: null
  };
}

function shouldSelectTheModelFile() {
  it('should select the model file', () => {
    component.nodeId = 'node1';
    component.componentId = 'component1';
    expect(component.componentContent.url).toEqual('glucose.html');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    const args = {
      nodeId: 'node1',
      componentId: 'component1',
      target: 'modelFile',
      targetObject: {},
      assetItem: {
        fileName: 'thermo.html'
      }
    };
    component.assetSelected(args);
    expect(component.componentContent.url).toEqual('thermo.html');
  });
}
