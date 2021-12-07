import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatPreviousWorkComponent } from './peer-chat-previous-work.component';

describe('PeerChatPreviousWorkComponent', () => {
  let component: PeerChatPreviousWorkComponent;
  let fixture: ComponentFixture<PeerChatPreviousWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatPreviousWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatPreviousWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
