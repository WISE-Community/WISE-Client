import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatAuthoringComponent } from './ai-chat-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditDialogGuidanceComputerAvatarComponent } from '../../dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ComponentAuthoringModule } from '../../component-authoring.module';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AiChatAuthoringComponent', () => {
  let component: AiChatAuthoringComponent;
  let fixture: ComponentFixture<AiChatAuthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatAuthoringComponent, EditDialogGuidanceComputerAvatarComponent],
      imports: [
        BrowserAnimationsModule,
        ComponentAuthoringModule,
        EditComponentPrompt,
        FormsModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(AiChatAuthoringComponent);
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'component1',
      type: 'aiChat',
      computerAvatarSettings: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
