import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatGradingComponent } from './ai-chat-grading.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AiChatGradingModule } from './ai-chat-grading.module';
import { ProjectService } from '../../../services/projectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AiChatGradingComponent', () => {
  let component: AiChatGradingComponent;
  let fixture: ComponentFixture<AiChatGradingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AiChatGradingComponent],
    imports: [AiChatGradingModule,
        MatDialogModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(AiChatGradingComponent);
    component = fixture.componentInstance;
    component.componentState = {
      studentData: {
        messages: []
      }
    };
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      id: 'component1',
      type: 'aiChat'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
