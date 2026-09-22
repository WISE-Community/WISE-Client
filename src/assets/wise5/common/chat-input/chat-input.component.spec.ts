import { ChatInputComponent } from './chat-input.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatInputComponent]
    });
    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should focus the textarea when the component renders', () => {
    expect(document.activeElement).toBe(component.textareaRef.nativeElement);
  });
});
