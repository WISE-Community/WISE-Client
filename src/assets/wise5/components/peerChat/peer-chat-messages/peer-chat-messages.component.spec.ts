import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatMessagesComponent } from './peer-chat-messages.component';

describe('PeerChatMessagesComponent', () => {
  let component: PeerChatMessagesComponent;
  let fixture: ComponentFixture<PeerChatMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
