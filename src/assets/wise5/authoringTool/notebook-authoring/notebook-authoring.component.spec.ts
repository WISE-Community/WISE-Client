import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookAuthoringComponent } from './notebook-authoring.component';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { FormsModule } from '@angular/forms';

describe('NotebookAuthoringComponent', () => {
  let component: NotebookAuthoringComponent;
  let fixture: ComponentFixture<NotebookAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotebookAuthoringComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [ConfigService, TeacherProjectService]
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
