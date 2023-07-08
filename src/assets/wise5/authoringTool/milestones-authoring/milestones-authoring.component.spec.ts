import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestonesAuthoringComponent } from './milestones-authoring.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';

describe('MilestonesAuthoringComponent', () => {
  let component: MilestonesAuthoringComponent;
  let fixture: ComponentFixture<MilestonesAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestonesAuthoringComponent],
      imports: [StudentTeacherCommonServicesModule],
      providers: [TeacherProjectService]
    }).compileComponents();

    fixture = TestBed.createComponent(MilestonesAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
