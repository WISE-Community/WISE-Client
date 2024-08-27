import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBranchPathsComponent } from './create-branch-paths.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { provideHttpClient } from '@angular/common/http';

describe('CreateBranchPathComponent', () => {
  let component: CreateBranchPathsComponent;
  let fixture: ComponentFixture<CreateBranchPathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBranchPathsComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(), TeacherProjectService]
    }).compileComponents();
    fixture = TestBed.createComponent(CreateBranchPathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
