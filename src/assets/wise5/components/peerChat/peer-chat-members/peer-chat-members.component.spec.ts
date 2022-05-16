import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { PeerChatMembersComponent } from './peer-chat-members.component';

describe('PeerChatMembersComponent', () => {
  let component: PeerChatMembersComponent;
  let fixture: ComponentFixture<PeerChatMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [PeerChatMembersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatMembersComponent);
    component = fixture.componentInstance;
    component.peerChatWorkgroupInfos = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
