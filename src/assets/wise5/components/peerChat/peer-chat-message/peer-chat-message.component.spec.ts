import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatMessageComponent } from './peer-chat-message.component';

describe('PeerChatMessageComponent', () => {
  let component: PeerChatMessageComponent;
  let fixture: ComponentFixture<PeerChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
