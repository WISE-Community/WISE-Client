import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicPromptComponent } from './dynamic-prompt.component';
import { DynamicPrompt } from './DynamicPrompt';

describe('DynamicPromptComponent', () => {
  let component: DynamicPromptComponent;
  let fixture: ComponentFixture<DynamicPromptComponent>;
  const postPrompt: string = 'This is the prompt after the dynamic prompt.';
  const prePrompt: string = 'This is the prompt before the dynamic prompt.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicPromptComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPromptComponent);
    component = fixture.componentInstance;
    component.dynamicPrompt = new DynamicPrompt({
      postPrompt: postPrompt,
      prePrompt: prePrompt
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
});
