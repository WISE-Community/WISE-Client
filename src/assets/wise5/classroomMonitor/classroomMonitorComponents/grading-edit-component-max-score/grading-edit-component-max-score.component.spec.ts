import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingEditComponentMaxScoreComponent } from './grading-edit-component-max-score.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../../services/configService';
import { SessionService } from '../../../services/sessionService';
import { CopyNodesService } from '../../../services/copyNodesService';

let component: GradingEditComponentMaxScoreComponent;
let fixture: ComponentFixture<GradingEditComponentMaxScoreComponent>;
let saveProjectSpy;
let setMaxScoreForComponentSpy;
let projectService: TeacherProjectService;

class MockService {}

describe('GradingEditComponentMaxScoreComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [GradingEditComponentMaxScoreComponent],
      providers: [
        { provide: ConfigService, useClass: MockService },
        CopyNodesService,
        { provide: SessionService, useClass: MockService },
        TeacherProjectService,
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    projectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(GradingEditComponentMaxScoreComponent);
    component = fixture.componentInstance;
    saveProjectSpy = spyOn(projectService, 'saveProject').and.callFake(() => {});
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
