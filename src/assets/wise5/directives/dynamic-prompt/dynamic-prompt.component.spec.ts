import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../services/annotationService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPromptComponent } from './dynamic-prompt.component';
import { DynamicPrompt } from './DynamicPrompt';

describe('DynamicPromptComponent', () => {
  let component: DynamicPromptComponent;
  let fixture: ComponentFixture<DynamicPromptComponent>;
  const postPrompt: string = 'This is the prompt after the dynamic prompt.';
  const prePrompt: string = 'This is the prompt before the dynamic prompt.';
  const promptScore1: string = 'This is the prompt when you get a score of 1.';
  const promptScore2: string = 'This is the prompt when you get a score of 2.';
  const promptDefault: string = 'This is the default prompt when no other rules match.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicPromptComponent],
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPromptComponent);
    component = fixture.componentInstance;
    component.dynamicPrompt = new DynamicPrompt({
      postPrompt: postPrompt,
      prePrompt: prePrompt,
      referenceComponent: {
        componentId: 'component1',
        nodeId: 'node1'
      },
      rules: [
        { id: 'ebtgds3b1r', expression: 'hasKIScore(2)', prompt: promptScore2 },
        { id: 'z4yu37jcis', expression: 'hasKIScore(1)', prompt: promptScore1 },
        { id: 'isDefault', expression: 'isDefault', prompt: promptDefault }
      ]
    });
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({
      type: 'OpenResponse'
    });
    spyOn(
      TestBed.inject(StudentDataService),
      'getLatestComponentStateByNodeIdAndComponentId'
    ).and.returnValue({
      studentData: {
        submitCounter: 1
      }
    });
    spyOn(TestBed.inject(AnnotationService), 'getLatestScoreAnnotation').and.returnValue({
      data: {
        ideas: [
          { name: '2', detected: false },
          { name: '3', detected: false }
        ],
        scores: [{ id: 'ki', score: 1 }]
      }
    });
    fixture.detectChanges();
  });

  it('should display the pre prompt', () => {
    const firstPrompt = fixture.debugElement.nativeElement.querySelectorAll('.prompt')[0];
    expect(firstPrompt.textContent).toEqual(prePrompt);
  });

  it('should display the post prompt', () => {
    const prompts = fixture.debugElement.nativeElement.querySelectorAll('.prompt');
    const lastPrompt = prompts[prompts.length - 1];
    expect(lastPrompt.textContent).toEqual(postPrompt);
  });

  it('should display the dynamic prompt', () => {
    const prompts = fixture.debugElement.nativeElement.querySelectorAll('.prompt');
    const dynamicPrompt = prompts[prompts.length - 2];
    expect(dynamicPrompt.textContent).toEqual(promptScore1);
  });
});
