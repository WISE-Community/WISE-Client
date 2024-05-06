import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchPathAuthoringComponent } from './branch-path-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';

describe('BranchPathAuthoringComponent', () => {
  let component: BranchPathAuthoringComponent;
  let fixture: ComponentFixture<BranchPathAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BranchPathAuthoringComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    fixture = TestBed.createComponent(BranchPathAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
