import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitSurveyComponent } from './submit-survey.component';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { LogOutService } from '../../../../app/services/logOutService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SubmitSurveyComponent', () => {
  let component: SubmitSurveyComponent;
  let fixture: ComponentFixture<SubmitSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSurveyComponent],
      providers: [
        ConfigService,
        LogOutService,
        NodeStatusService,
        ProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
