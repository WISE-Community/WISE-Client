import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatMessagesComponent } from './ai-chat-messages.component';

describe('AiChatMessagesComponent', () => {
  let component: AiChatMessagesComponent;
  let fixture: ComponentFixture<AiChatMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatMessagesComponent]
    });
    fixture = TestBed.createComponent(AiChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
