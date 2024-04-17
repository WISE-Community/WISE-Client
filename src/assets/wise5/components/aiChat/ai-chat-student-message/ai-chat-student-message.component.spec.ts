import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatStudentMessageComponent } from './ai-chat-student-message.component';
import { ConfigService } from '../../../services/configService';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AiChatStudentMessageComponent', () => {
  let component: AiChatStudentMessageComponent;
  let fixture: ComponentFixture<AiChatStudentMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatStudentMessageComponent],
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });
    fixture = TestBed.createComponent(AiChatStudentMessageComponent);
    component = fixture.componentInstance;
    component.message = { content: 'Hello', role: 'user' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
