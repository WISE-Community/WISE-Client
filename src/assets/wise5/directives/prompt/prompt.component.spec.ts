import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { ComponentContent } from '../../common/ComponentContent';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ConstraintService } from '../../services/constraintService';
import { PeerGroupService } from '../../services/peerGroupService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PromptComponent } from './prompt.component';
import { Component } from '../../common/Component';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  const promptText: string = 'This is the regular prompt.';
  const postPromptText: string = 'This is the prompt after the dynamic prompt.';
  const prePromptText: string = 'This is the prompt before the dynamic prompt.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptComponent],
      providers: [
        MockProviders(
          AnnotationService,
          ConfigService,
          ConstraintService,
          StudentDataService,
          PeerGroupService,
          ProjectService
        )
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
    const projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getComponent').and.returnValue({
      type: 'OpenResponse'
    } as ComponentContent);
    spyOn(projectService, 'getReferenceComponent').and.returnValue({
      content: { type: 'OpenResponse' }
    } as Component);
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
