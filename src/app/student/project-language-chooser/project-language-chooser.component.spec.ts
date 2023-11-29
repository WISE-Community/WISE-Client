import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLanguageChooserComponent } from './project-language-chooser.component';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ProjectLocale } from '../../domain/projectLocale';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let projectService: ProjectService;
describe('ProjectLanguageChooserComponent', () => {
  let component: ProjectLanguageChooserComponent;
  let fixture: ComponentFixture<ProjectLanguageChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ProjectLanguageChooserComponent,
        StudentTeacherCommonServicesModule
      ]
    }).compileComponents();
    projectService = TestBed.inject(ProjectService);
  });

  beforeEach(() => {
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale());
    fixture = TestBed.createComponent(ProjectLanguageChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
