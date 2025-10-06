import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatStudentMessageComponent } from './ai-chat-student-message.component';
import { ConfigService } from '../../../services/configService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AiChatMessage } from '../AiChatMessage';

describe('AiChatStudentMessageComponent', () => {
  let component: AiChatStudentMessageComponent;
  let fixture: ComponentFixture<AiChatStudentMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiChatStudentMessageComponent],
      providers: [
        ConfigService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(AiChatStudentMessageComponent);
    component = fixture.componentInstance;
    component.message = new AiChatMessage('user', 'Hello');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
