import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { UtilService } from '../../../services/utilService';
import { PeerChatMessage } from '../PeerChatMessage';

import { PeerChatMessageComponent } from './peer-chat-message.component';

const peerChatMessage: PeerChatMessage = new PeerChatMessage(1, 'hello', 1638298056);

describe('PeerChatMessageComponent', () => {
  let component: PeerChatMessageComponent;
  let fixture: ComponentFixture<PeerChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PeerChatMessageComponent],
      providers: [ConfigService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatMessageComponent);
    component = fixture.componentInstance;
    component.peerChatMessage = peerChatMessage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
