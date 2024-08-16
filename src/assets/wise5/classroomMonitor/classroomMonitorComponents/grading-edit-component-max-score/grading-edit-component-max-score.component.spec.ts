import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingEditComponentMaxScoreComponent } from './grading-edit-component-max-score.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CopyNodesService } from '../../../services/copyNodesService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentContent } from '../../../common/ComponentContent';

let component: GradingEditComponentMaxScoreComponent;
let fixture: ComponentFixture<GradingEditComponentMaxScoreComponent>;
let saveProjectSpy;
let getComponentSpy;
let projectService: TeacherProjectService;

describe('GradingEditComponentMaxScoreComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradingEditComponentMaxScoreComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [StudentTeacherCommonServicesModule],
      providers: [
        CopyNodesService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    projectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(GradingEditComponentMaxScoreComponent);
    component = fixture.componentInstance;
    saveProjectSpy = spyOn(projectService, 'saveProject').and.callFake(() => new Promise(() => {}));
    getComponentSpy = spyOn(projectService, 'getComponent').and.returnValue({} as ComponentContent);
  });
  saveMaxScore();
});

function saveMaxScore() {
  describe('saveMaxScore()', () => {
    it('should save null, 0 or greater value', () => {
      shouldSave(null);
      shouldSave(0);
      shouldSave(11);
    });
    it('should not save negative value', () => {
      shouldNotSave(-5);
    });
  });
}

function shouldSave(maxScore: number) {
  setMaxScoreAndSave(maxScore);
  expect(getComponentSpy).toHaveBeenCalled();
  expect(saveProjectSpy).toHaveBeenCalled();
}

function shouldNotSave(maxScore: number) {
  setMaxScoreAndSave(maxScore);
  expect(getComponentSpy).not.toHaveBeenCalled();
  expect(saveProjectSpy).not.toHaveBeenCalled();
}

function setMaxScoreAndSave(maxScore: number) {
  component.maxScore = maxScore;
  component.saveMaxScore();
}
