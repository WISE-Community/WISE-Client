import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatQuestionBankComponent } from './peer-chat-question-bank.component';

describe('PeerChatQuestionBankComponent', () => {
  let component: PeerChatQuestionBankComponent;
  let fixture: ComponentFixture<PeerChatQuestionBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatQuestionBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
