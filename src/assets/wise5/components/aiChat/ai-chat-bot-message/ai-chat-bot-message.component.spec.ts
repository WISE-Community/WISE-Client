import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatBotMessageComponent } from './ai-chat-bot-message.component';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { AiChatMessage } from '../AiChatMessage';

describe('AiChatBotMessageComponent', () => {
  let component: AiChatBotMessageComponent;
  let fixture: ComponentFixture<AiChatBotMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiChatBotMessageComponent],
      providers: [ComputerAvatarService]
    });
    fixture = TestBed.createComponent(AiChatBotMessageComponent);
    component = fixture.componentInstance;
    component.message = new AiChatMessage('assistant', 'Hello');
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
