import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerChatMessageComponent } from '../peer-chat-message/peer-chat-message.component';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatMessagesComponent } from './peer-chat-messages.component';

let component: PeerChatMessagesComponent;
let fixture: ComponentFixture<PeerChatMessagesComponent>;
const messageText1 = 'Hello';
const messageText2 = 'World';
const messageText3 = 'Oops';
const studentWorkgroupId1 = 101;
const studentWorkgroupId2 = 102;
const teacherWorkgroupId1 = 100;

describe('PeerChatMessagesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerChatMessageComponent, PeerChatMessagesComponent],
      imports: [HttpClientTestingModule, MatIconModule, StudentTeacherCommonServicesModule]
    }).compileComponents();
    fixture = TestBed.createComponent(PeerChatMessagesComponent);
    component = fixture.componentInstance;
    component.peerChatMessages = [
      new PeerChatMessage(studentWorkgroupId1, messageText1, 1000, 1, false),
      new PeerChatMessage(studentWorkgroupId2, messageText2, 2000, 2, false),
      new PeerChatMessage(studentWorkgroupId1, messageText3, 3000, 3, true)
    ];
    const workgroupInfos = {};
    workgroupInfos[teacherWorkgroupId1] = { avatarColor: 'orange' };
    workgroupInfos[studentWorkgroupId1] = { avatarColor: 'blue' };
    workgroupInfos[studentWorkgroupId2] = { avatarColor: 'green' };
    component.workgroupInfos = workgroupInfos;
    fixture.detectChanges();
  });
  showMessagesNotInGradingMode();
  showMessagesInGradingMode();
});

function showMessagesNotInGradingMode() {
  it('should only show messages that are not deleted when not in grading mode', () => {
    component.myWorkgroupId = studentWorkgroupId2;
    component.isGrading = false;
    fixture.detectChanges();
    expectMessages([messageText1, messageText2]);
  });
}

function showMessagesInGradingMode() {
  it('should show all messages in grading mode', () => {
    component.myWorkgroupId = teacherWorkgroupId1;
    component.isGrading = true;
    fixture.detectChanges();
    expectMessages([messageText1, messageText2, messageText3]);
  });
}

function expectMessages(messageTexts: string[]) {
  const peerChatMessageComponents = fixture.debugElement.queryAll(
    By.directive(PeerChatMessageComponent)
  );
  expect(peerChatMessageComponents.length).toEqual(messageTexts.length);
  for (let i = 0; i < messageTexts.length; i++) {
    expect(peerChatMessageComponents[i].nativeElement.textContent).toContain(messageTexts[i]);
  }
}
