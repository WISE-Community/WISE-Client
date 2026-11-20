import { ChatInputComponent } from './chat-input.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;
  let focusSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatInputComponent]
    });
    focusSpy = spyOn(HTMLTextAreaElement.prototype, 'focus').and.callThrough();
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

  it('should not scroll the page when focusing the textarea', () => {
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });
});
