import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';
import { DialogGuidanceAuthoringModule } from './dialog-guidance-authoring.module';

const componentContent = {
  id: 'i64ex48j1z',
  type: 'DialogGuidance',
  prompt: '',
  feedbackRules: [],
  showSaveButton: false,
  showSubmitButton: false,
  isComputerAvatarEnabled: false
};

describe('DialogGuidanceAuthoringComponent', () => {
  let component: DialogGuidanceAuthoringComponent;
  let fixture: ComponentFixture<DialogGuidanceAuthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ComponentServiceLookupServiceModule,
        DialogGuidanceAuthoringModule,
        HttpClientTestingModule
      ]
    });
    fixture = TestBed.createComponent(DialogGuidanceAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
