import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerChatContent } from '../PeerChatContent';
import { EditPeerChatAdvancedComponentComponent } from './edit-peer-chat-advanced-component.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TeacherNodeService } from '../../../services/teacherNodeService';

describe('EditPeerChatAdvancedComponentComponent', () => {
  let component: EditPeerChatAdvancedComponentComponent;
  let fixture: ComponentFixture<EditPeerChatAdvancedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [EditPeerChatAdvancedComponentComponent],
      providers: [TeacherNodeService, TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      {} as PeerChatContent
    );
    fixture = TestBed.createComponent(EditPeerChatAdvancedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
