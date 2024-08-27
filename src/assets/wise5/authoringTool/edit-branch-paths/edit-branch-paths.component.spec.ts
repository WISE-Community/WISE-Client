import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBranchPathsComponent } from './edit-branch-paths.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { provideHttpClient } from '@angular/common/http';

describe('EditBranchPathsComponent', () => {
  let component: EditBranchPathsComponent;
  let fixture: ComponentFixture<EditBranchPathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBranchPathsComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(), TeacherProjectService]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBranchPathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});