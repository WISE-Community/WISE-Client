import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatMemberTypingIndicatorComponent } from './peer-chat-member-typing-indicator.component';
import { ConfigService } from '../../../services/configService';
import { StompService } from '../../../services/stompService';
import { PeerGroup } from '../PeerGroup';
import { StudentDataService } from '../../../services/studentDataService';
import { Subject } from 'rxjs';

class MockConfigService {}
class MockStudentDataService {
  private studentWorkReceivedSource: Subject<any> = new Subject<any>();
  public studentWorkReceived$ = this.studentWorkReceivedSource.asObservable();
}
describe('PeerChatMemberTypingIndicatorComponent', () => {
  let component: PeerChatMemberTypingIndicatorComponent;
  let fixture: ComponentFixture<PeerChatMemberTypingIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerChatMemberTypingIndicatorComponent],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        StompService,
        { provide: StudentDataService, useClass: MockStudentDataService }
      ]
    });
    fixture = TestBed.createComponent(PeerChatMemberTypingIndicatorComponent);
    component = fixture.componentInstance;
    component.peerGroup = new PeerGroup(1, [], null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
