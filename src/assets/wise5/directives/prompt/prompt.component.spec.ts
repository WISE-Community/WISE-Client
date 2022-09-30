import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicPromptComponent } from '../dynamic-prompt/dynamic-prompt.component';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PromptComponent } from './prompt.component';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  const promptText: string = 'This is the prompt.';
  const postPromptText: string = 'This is the prompt after the dynamic prompt.';
  const prePromptText: string = 'This is the prompt before the dynamic prompt.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromptComponent, DynamicPromptComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    component.prompt = promptText;
    component.dynamicPrompt = new DynamicPrompt({
      enabled: false,
      postPrompt: postPromptText,
      prePrompt: prePromptText
    });
    fixture.detectChanges();
  });

  it('should display the regular prompt', () => {
    const promptElement = fixture.debugElement.nativeElement.querySelector('.prompt');
    expect(promptElement.textContent).toEqual(promptText);
  });

  it('should display the dynamic prompt', () => {
    component.dynamicPrompt.enabled = true;
    fixture.detectChanges();
    const prompts = fixture.debugElement.nativeElement.querySelectorAll('.prompt');
    expect(prompts[0].textContent).toEqual(prePromptText);
    expect(prompts[prompts.length - 1].textContent).toEqual(postPromptText);
  });
});
