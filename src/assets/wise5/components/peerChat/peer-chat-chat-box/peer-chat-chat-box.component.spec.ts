import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box.component';
import { MockComponents } from 'ng-mocks';
import { PeerChatMemberTypingIndicatorComponent } from '../peer-chat-member-typing-indicator/peer-chat-member-typing-indicator.component';
import { PeerChatMessageInputComponent } from '../peer-chat-message-input/peer-chat-message-input.component';

describe('PeerChatChatBoxComponent', () => {
  let component: PeerChatChatBoxComponent;
  let fixture: ComponentFixture<PeerChatChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PeerChatChatBoxComponent,
        MockComponents(PeerChatMessageInputComponent, PeerChatMemberTypingIndicatorComponent)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatChatBoxComponent);
    component = fixture.componentInstance;
    component.workgroupInfos = {
      1: { isTeacher: true },
      2: { isTeacher: false },
      3: { isTeacher: false }
    };
    fixture.detectChanges();
  });

  it('should create with workgroup infos without teachers', () => {
    expect(component).toBeTruthy();
    expect(component['workgroupInfosWithoutTeachers']).toEqual([
      { isTeacher: false },
      { isTeacher: false }
    ]);
  });
});
