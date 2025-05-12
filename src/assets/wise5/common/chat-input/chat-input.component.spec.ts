import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatInputComponent } from './chat-input.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { PingEndpointService } from '../../services/pingEndpointService';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ChatInputComponent],
      providers: [MockProvider(PingEndpointService)]
    });
    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
