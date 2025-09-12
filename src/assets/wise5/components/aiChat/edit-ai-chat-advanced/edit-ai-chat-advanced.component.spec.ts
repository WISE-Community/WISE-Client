import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditAiChatAdvancedComponent } from './edit-ai-chat-advanced.component';

describe('EditAiChatAdvancedComponent', () => {
  let component: EditAiChatAdvancedComponent;
  let fixture: ComponentFixture<EditAiChatAdvancedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditAiChatAdvancedComponent, StudentTeacherCommonServicesModule],
      providers: [
        TeacherNodeService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    fixture = TestBed.createComponent(EditAiChatAdvancedComponent);
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue({
      id: 'component1',
      type: 'aiChat'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
