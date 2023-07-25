import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

describe('ChooseAutomatedAssessmentComponent', () => {
  let component: ChooseAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ChooseAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseAutomatedAssessmentComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatRadioModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(ChooseAutomatedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
