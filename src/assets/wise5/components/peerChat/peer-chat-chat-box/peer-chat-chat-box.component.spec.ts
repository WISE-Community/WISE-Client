import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box.component';
import { MockComponents } from 'ng-mocks';
import { PeerChatMemberTypingIndicatorComponent } from '../peer-chat-member-typing-indicator/peer-chat-member-typing-indicator.component';
import { PeerChatMessageInputComponent } from '../peer-chat-message-input/peer-chat-message-input.component';
import { PeerChatMessagesComponent } from '../peer-chat-messages/peer-chat-messages.component';

describe('PeerChatChatBoxComponent', () => {
  let component: PeerChatChatBoxComponent;
  let fixture: ComponentFixture<PeerChatChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PeerChatChatBoxComponent,
        MockComponents(
          PeerChatMessageInputComponent,
          PeerChatMemberTypingIndicatorComponent,
          PeerChatMessagesComponent
        )
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
