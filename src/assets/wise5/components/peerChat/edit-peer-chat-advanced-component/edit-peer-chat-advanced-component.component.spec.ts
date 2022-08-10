import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditPeerChatAdvancedComponentComponent } from './edit-peer-chat-advanced-component.component';

describe('EditPeerChatAdvancedComponentComponent', () => {
  let component: EditPeerChatAdvancedComponentComponent;
  let fixture: ComponentFixture<EditPeerChatAdvancedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [EditPeerChatAdvancedComponentComponent],
      providers: [TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerChatAdvancedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
