import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatMessagesComponent } from './peer-chat-messages.component';

let component: PeerChatMessagesComponent;
let fixture: ComponentFixture<PeerChatMessagesComponent>;

describe('PeerChatMessagesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerChatMessagesComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PeerChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
