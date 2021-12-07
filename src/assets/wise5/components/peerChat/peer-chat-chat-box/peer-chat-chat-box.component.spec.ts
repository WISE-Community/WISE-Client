import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatChatBoxComponent } from './peer-chat-chat-box.component';

describe('PeerChatChatBoxComponent', () => {
  let component: PeerChatChatBoxComponent;
  let fixture: ComponentFixture<PeerChatChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatChatBoxComponent ]
    })
    .compileComponents();
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
