import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ConfigService } from '../../../services/configService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatMessageComponent } from './peer-chat-message.component';

let component: PeerChatMessageComponent;
let fixture: ComponentFixture<PeerChatMessageComponent>;
const messageText = 'hello';

describe('PeerChatMessageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule],
      declarations: [PeerChatMessageComponent],
      providers: [ConfigService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatMessageComponent);
    component = fixture.componentInstance;
    component.peerChatMessage = new PeerChatMessage(1, messageText, 1638298056);
    fixture.detectChanges();
  });

  shouldShowMessageText();
  shouldNotShowDeleteButtonWhenNotGrading();
  shouldShowDeleteButtonInGrading();
  shouldShowUndeleteButtonInGrading();
});

function shouldShowMessageText() {
  it('should show message text', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.textContent).toContain(messageText);
  });
}

function shouldNotShowDeleteButtonWhenNotGrading() {
  it('should not show delete button when not grading', () => {
    component.isGrading = false;
    fixture.detectChanges();
    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(icons.length).toEqual(1);
    expect(icons[0].nativeElement.textContent).toContain('account_circle');
  });
}

function shouldShowDeleteButtonInGrading() {
  it('should show delete button', () => {
    expectWhichDeleteButton(false, 'visibility');
  });
}

function shouldShowUndeleteButtonInGrading() {
  it('should show undelete button', () => {
    expectWhichDeleteButton(true, 'visibility_off');
  });
}

function expectWhichDeleteButton(isDeleted: boolean, iconName: string) {
  component.isGrading = true;
  component.peerChatMessage.isDeleted = isDeleted;
  fixture.detectChanges();
  const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
  expect(icons[1].nativeElement.textContent).toContain(iconName);
}
