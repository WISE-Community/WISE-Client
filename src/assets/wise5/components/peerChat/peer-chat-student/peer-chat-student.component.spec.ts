import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerChatStudentComponent } from './peer-chat-student.component';

describe('PeerChatStudentComponent', () => {
  let component: PeerChatStudentComponent;
  let fixture: ComponentFixture<PeerChatStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerChatStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
