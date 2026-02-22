import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatStudentComponent } from './ai-chat-student.component';
import { AiChatService } from '../aiChatService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AiChatComponent } from '../AiChatComponent';
import { ProjectService } from '../../../services/projectService';
import { provideHttpClient } from '@angular/common/http';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';

describe('AiChatStudentComponent', () => {
  let component: AiChatStudentComponent;
  let fixture: ComponentFixture<AiChatStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, AiChatStudentComponent],
      providers: [AiChatService, provideHttpClient()]
    });
    fixture = TestBed.createComponent(AiChatStudentComponent);
    component = fixture.componentInstance;
    component.component = new AiChatComponent({ id: 'component1', type: 'aiChat' }, 'node1');
    component.componentState = { studentData: { messages: [{ role: 'user' }] } };
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    fixture.detectChanges();
  });

  it('should not show response from a connected component', async () => {
    const studentMessages = fixture.debugElement.queryAll(By.css('ai-chat-student-message'));
    expect(studentMessages.length).toBe(1);
    component.processConnectedComponentState({ studentData: { response: 'test response' } });
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await (await loader.getHarness(MatButtonHarness)).click();
    expect(studentMessages.length).toBe(1); // no new message should be added
  });
});
