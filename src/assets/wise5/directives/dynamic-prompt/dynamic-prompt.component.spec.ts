import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PeerGroupStudentData } from '../../../../app/domain/peerGroupStudentData';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../common/ComponentContent';
import { AnnotationService } from '../../services/annotationService';
import { PeerGroupService } from '../../services/peerGroupService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPromptComponent } from './dynamic-prompt.component';
import { DynamicPrompt } from './DynamicPrompt';

let component: DynamicPromptComponent;
let fixture: ComponentFixture<DynamicPromptComponent>;
const postPrompt: string = 'This is the prompt after the dynamic prompt.';
const prePrompt: string = 'This is the prompt before the dynamic prompt.';
const promptDefault: string = 'This is the default prompt when no other rules match.';
const promptIdea2And3: string = 'This is the prompt when you get idea 2 and idea 3.';
const promptIdea2Or3: string = 'This is the prompt when you get idea 2 or idea 3.';
const promptScore1: string = 'This is the prompt when you get a score of 1.';
const promptScore2: string = 'This is the prompt when you get a score of 2.';

describe('DynamicPromptComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicPromptComponent],
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      type: 'OpenResponse'
    } as ComponentContent);
    fixture = TestBed.createComponent(DynamicPromptComponent);
    component = fixture.componentInstance;
    component.dynamicPrompt = createDynamicPrompt();
  });

  peerGroupingTagDisabled();
  peerGroupingTagEnabled();
});

function peerGroupingTagDisabled(): void {
  describe('peerGroupingTagDisabled', () => {
    beforeEach(() => {
      spyOn(
        TestBed.inject(StudentDataService),
        'getLatestComponentStateByNodeIdAndComponentId'
      ).and.returnValue(createComponentState(1));
      spyOn(TestBed.inject(AnnotationService), 'getLatestScoreAnnotation').and.returnValue(
        createAnnotation([], 1)
      );
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
      expectDynamicPromptToEqual(promptScore1);
    });
  });
}

function peerGroupingTagEnabled(): void {
  let retrieveStudentDataSpy: jasmine.Spy;
  describe('peerGroupingTagEnabled', () => {
    beforeEach(() => {
      component.dynamicPrompt.peerGroupingTag = 'apple';
      spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroup').and.returnValue(
        of(createPeerGroup())
      );
      retrieveStudentDataSpy = spyOn(
        TestBed.inject(PeerGroupService),
        'retrieveDynamicPromptStudentData'
      );
    });

    it('should display the dynamic prompt when idea 2 and 3 are detected', () => {
      retrieveStudentDataSpy.and.returnValue(of([createPeerGroupStudentData(['2', '3'], 2, 1)]));
      fixture.detectChanges();
      expectDynamicPromptToEqual(promptIdea2And3);
    });

    it('should display the dynamic prompt when idea 2 or 3 are detected', () => {
      retrieveStudentDataSpy.and.returnValue(of([createPeerGroupStudentData(['2'], 2, 1)]));
      fixture.detectChanges();
      expectDynamicPromptToEqual(promptIdea2Or3);
    });
  });
}

function createPeerGroupStudentData(
  ideas: string[],
  score: number,
  submitCounter: number
): PeerGroupStudentData {
  return {
    annotation: createAnnotation(ideas, score),
    studentWork: createComponentState(submitCounter),
    workgroup: {}
  };
}

function expectDynamicPromptToEqual(text: string): void {
  const prompts = fixture.debugElement.nativeElement.querySelectorAll('.prompt');
  const dynamicPrompt = prompts[prompts.length - 2];
  expect(dynamicPrompt.textContent).toEqual(text);
}

function createDynamicPrompt(): DynamicPrompt {
  return new DynamicPrompt({
    postPrompt: postPrompt,
    prePrompt: prePrompt,
    referenceComponent: {
      componentId: 'component1',
      nodeId: 'node1'
    },
    rules: [
      { id: '35ryu890fh', expression: '2 && 3', prompt: promptIdea2And3 },
      { id: 'df9vk3nags', expression: '2 || 3', prompt: promptIdea2Or3 },
      { id: 'ebtgds3b1r', expression: 'hasKIScore(2)', prompt: promptScore2 },
      { id: 'z4yu37jcis', expression: 'hasKIScore(1)', prompt: promptScore1 },
      { id: 'isDefault', expression: 'isDefault', prompt: promptDefault }
    ]
  });
}

function createPeerGroup(): any {
  return {
    id: 1,
    members: [
      { id: 1, periodId: 1 },
      { id: 2, periodId: 1 },
      { id: 3, periodId: 1 }
    ],
    periodId: 1
  };
}

function createComponentState(submitCounter: number): any {
  return {
    studentData: {
      submitCounter: submitCounter
    }
  };
}

function createAnnotation(ideas: string[], score: number): any {
  const annotation = {
    data: {
      ideas: [],
      scores: [
        { id: 'nonscoreable', score: 0 },
        { id: 'ki', score: score }
      ]
    }
  };
  for (const idea of ideas) {
    annotation.data.ideas.push({ name: idea, detected: true });
  }
  return annotation;
}
