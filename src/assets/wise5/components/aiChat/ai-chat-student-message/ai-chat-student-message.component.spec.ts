import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatStudentMessageComponent } from './ai-chat-student-message.component';
import { ConfigService } from '../../../services/configService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AiChatStudentMessageComponent', () => {
  let component: AiChatStudentMessageComponent;
  let fixture: ComponentFixture<AiChatStudentMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AiChatStudentMessageComponent],
    imports: [],
    providers: [ConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
