import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank.component';

let component: PeerChatQuestionBankComponent;
let fixture: ComponentFixture<PeerChatQuestionBankComponent>;

describe('PeerChatQuestionBankComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerChatQuestionBankComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PeerChatQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
