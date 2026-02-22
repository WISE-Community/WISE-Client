import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatGradingComponent } from './ai-chat-grading.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { provideHttpClient } from '@angular/common/http';

describe('AiChatGradingComponent', () => {
  let component: AiChatGradingComponent;
  let fixture: ComponentFixture<AiChatGradingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, AiChatGradingComponent],
      providers: [provideHttpClient()]
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
