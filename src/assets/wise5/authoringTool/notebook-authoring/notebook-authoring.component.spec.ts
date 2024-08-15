import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookAuthoringComponent } from './notebook-authoring.component';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotebookAuthoringComponent', () => {
  let component: NotebookAuthoringComponent;
  let fixture: ComponentFixture<NotebookAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NotebookAuthoringComponent],
    imports: [FormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        StudentTeacherCommonServicesModule],
    providers: [ConfigService, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    TestBed.inject(TeacherProjectService).project = {};
    fixture = TestBed.createComponent(NotebookAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
