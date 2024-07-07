import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../common/ComponentContent';
import { ProjectService } from '../../services/projectService';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PromptComponent } from './prompt.component';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  const promptText: string = 'This is the regular prompt.';
  const postPromptText: string = 'This is the prompt after the dynamic prompt.';
  const prePromptText: string = 'This is the prompt before the dynamic prompt.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        PromptComponent,
        StudentTeacherCommonServicesModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    component.prompt = promptText;
    component.dynamicPrompt = new DynamicPrompt({
      enabled: false,
      postPrompt: postPromptText,
      prePrompt: prePromptText,
      referenceComponent: {
        componentId: 'component1',
        nodeId: 'node1'
      }
    });
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      type: 'OpenResponse'
    } as ComponentContent);
    fixture.detectChanges();
  });

  it('should display the regular prompt', () => {
    const promptElement = fixture.debugElement.nativeElement.querySelector('.prompt');
    expect(promptElement.textContent).toEqual(promptText);
  });

  it('should not display the regular prompt2', () => {
    component.dynamicPrompt.enabled = true;
    fixture.detectChanges();
    const prompt = fixture.debugElement.nativeElement.querySelector('.prompt');
    expect(prompt.textContent).not.toEqual(promptText);
  });
});
