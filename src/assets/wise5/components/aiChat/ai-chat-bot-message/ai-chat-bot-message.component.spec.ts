import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatBotMessageComponent } from './ai-chat-bot-message.component';
import { MatIconModule } from '@angular/material/icon';

describe('AiChatBotMessageComponent', () => {
  let component: AiChatBotMessageComponent;
  let fixture: ComponentFixture<AiChatBotMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatBotMessageComponent],
      imports: [MatIconModule]
    });
    fixture = TestBed.createComponent(AiChatBotMessageComponent);
    component = fixture.componentInstance;
    component.message = { content: 'Hello', role: 'assistant' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
