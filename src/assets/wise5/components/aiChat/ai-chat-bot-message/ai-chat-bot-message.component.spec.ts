import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatBotMessageComponent } from './ai-chat-bot-message.component';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { MatIconModule } from '@angular/material/icon';

describe('AiChatBotMessageComponent', () => {
  let component: AiChatBotMessageComponent;
  let fixture: ComponentFixture<AiChatBotMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatBotMessageComponent],
      imports: [MatIconModule],
      providers: [ComputerAvatarService]
    });
    fixture = TestBed.createComponent(AiChatBotMessageComponent);
    component = fixture.componentInstance;
    component.message = { content: 'Hello', role: 'assistant' };
    component.computerAvatar = {
      id: 'robot1',
      name: 'Robot',
      image: 'robot-1.png',
      isSelected: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
