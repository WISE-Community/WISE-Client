import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBranchComponent } from './create-branch.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { CreateBranchService } from '../../services/createBranchService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let projectService: TeacherProjectService;
let component: CreateBranchComponent;
let fixture: ComponentFixture<CreateBranchComponent>;
describe('CreateBranchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateBranchComponent, BrowserAnimationsModule, StudentTeacherCommonServicesModule],
      providers: [
        CreateBranchService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        TeacherProjectService
      ]
    });
    window.history.pushState({}, '', '');
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue([]);
    fixture = TestBed.createComponent(CreateBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
