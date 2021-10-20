import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatGradingComponent } from './peer-chat-grading.component';

describe('PeerChatGradingComponent', () => {
  let component: PeerChatGradingComponent;
  let fixture: ComponentFixture<PeerChatGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatGradingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
