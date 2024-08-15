import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatStudentComponent } from './ai-chat-student.component';
import { AiChatService } from '../aiChatService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { AiChatModule } from '../ai-chat.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AiChatComponent } from '../AiChatComponent';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../../services/projectService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatInputComponent } from '../../../common/chat-input/chat-input.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AiChatStudentComponent', () => {
  let component: AiChatStudentComponent;
  let fixture: ComponentFixture<AiChatStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AiChatStudentComponent],
    imports: [AiChatModule,
        BrowserAnimationsModule,
        ChatInputComponent,
        ComponentHeaderComponent,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        StudentTeacherCommonServicesModule],
    providers: [AiChatService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(AiChatStudentComponent);
    component = fixture.componentInstance;
    component.component = new AiChatComponent({ id: 'component1', type: 'aiChat' }, 'node1');
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
