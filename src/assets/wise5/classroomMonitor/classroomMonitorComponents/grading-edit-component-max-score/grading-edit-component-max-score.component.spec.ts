import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingEditComponentMaxScoreComponent } from './grading-edit-component-max-score.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CopyNodesService } from '../../../services/copyNodesService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

let component: GradingEditComponentMaxScoreComponent;
let fixture: ComponentFixture<GradingEditComponentMaxScoreComponent>;
let saveProjectSpy;
let setMaxScoreForComponentSpy;
let projectService: TeacherProjectService;

describe('GradingEditComponentMaxScoreComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [GradingEditComponentMaxScoreComponent],
      providers: [CopyNodesService, TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    projectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(GradingEditComponentMaxScoreComponent);
    component = fixture.componentInstance;
    saveProjectSpy = spyOn(projectService, 'saveProject').and.callFake(() => new Promise(() => {}));
    setMaxScoreForComponentSpy = spyOn(
      projectService,
      'setMaxScoreForComponent'
    ).and.callFake(() => {});
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
  expect(setMaxScoreForComponentSpy).toHaveBeenCalled();
  expect(saveProjectSpy).toHaveBeenCalled();
}

function shouldNotSave(maxScore: number) {
  setMaxScoreAndSave(maxScore);
  expect(setMaxScoreForComponentSpy).not.toHaveBeenCalled();
  expect(saveProjectSpy).not.toHaveBeenCalled();
}

function setMaxScoreAndSave(maxScore: number) {
  component.maxScore = maxScore;
  component.saveMaxScore();
}
