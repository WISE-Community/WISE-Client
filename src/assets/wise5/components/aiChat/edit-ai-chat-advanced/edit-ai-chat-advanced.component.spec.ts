import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAiChatAdvancedComponent } from './edit-ai-chat-advanced.component';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentAuthoringModule } from '../../../../../app/teacher/component-authoring.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditAiChatAdvancedComponent', () => {
  let component: EditAiChatAdvancedComponent;
  let fixture: ComponentFixture<EditAiChatAdvancedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [EditAiChatAdvancedComponent],
    imports: [BrowserAnimationsModule,
        ComponentAuthoringModule,
        MatDialogModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherNodeService, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
