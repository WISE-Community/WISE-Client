import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { UpgradeModule } from '@angular/upgrade/static';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

describe('ConfigureAutomatedAssessmentComponent', () => {
  let component: ConfigureAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ConfigureAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureAutomatedAssessmentComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: (param: string) => {
        if (param === '$state') {
          return {
            go: (route: string, params: any) => {}
          };
        } else if (param === '$stateParams') {
          return {
            node: {
              components: []
            },
            importFromProjectId: 1
          };
        }
      }
    };
    fixture = TestBed.createComponent(ConfigureAutomatedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
