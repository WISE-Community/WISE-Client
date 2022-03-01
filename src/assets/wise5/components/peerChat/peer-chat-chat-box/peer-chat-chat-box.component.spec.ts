import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeerChatMembersComponent } from '../peer-chat-members/peer-chat-members.component';
import { PeerChatMessageInputComponent } from '../peer-chat-message-input/peer-chat-message-input.component';

import { PeerChatChatBoxComponent } from './peer-chat-chat-box.component';

describe('PeerChatChatBoxComponent', () => {
  let component: PeerChatChatBoxComponent;
  let fixture: ComponentFixture<PeerChatChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [
        PeerChatChatBoxComponent,
        PeerChatMembersComponent,
        PeerChatMessageInputComponent
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
    expect(component.workgroupInfosWithoutTeachers).toEqual([
      { isTeacher: false },
      { isTeacher: false }
    ]);
  });
});
