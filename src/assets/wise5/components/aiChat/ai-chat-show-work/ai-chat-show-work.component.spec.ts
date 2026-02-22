import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatShowWorkComponent } from './ai-chat-show-work.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { provideHttpClient } from '@angular/common/http';

describe('AiChatShowWorkComponent', () => {
  let component: AiChatShowWorkComponent;
  let fixture: ComponentFixture<AiChatShowWorkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, AiChatShowWorkComponent],
      providers: [provideHttpClient()]
    });
    fixture = TestBed.createComponent(AiChatShowWorkComponent);
    component = fixture.componentInstance;
    component.componentState = {
      studentData: {}
    };
    component.componentContent = {};
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
