import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatInputComponent } from './chat-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ChatInputComponent]
    });
    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
