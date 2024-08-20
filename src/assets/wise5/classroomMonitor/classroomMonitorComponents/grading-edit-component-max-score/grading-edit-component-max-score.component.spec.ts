import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingEditComponentMaxScoreComponent } from './grading-edit-component-max-score.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CopyNodesService } from '../../../services/copyNodesService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Node } from '../../../common/Node';

let component: GradingEditComponentMaxScoreComponent;
let fixture: ComponentFixture<GradingEditComponentMaxScoreComponent>;
let saveProjectSpy;
let getNodeSpy;
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
    component.componentId = 'c1';
    saveProjectSpy = spyOn(projectService, 'saveProject').and.callFake(() => new Promise(() => {}));
    const node = new Node();
    node.components = [{ id: 'c1' }];
    getNodeSpy = spyOn(projectService, 'getNode').and.returnValue(node);
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
  expect(getNodeSpy).toHaveBeenCalled();
  expect(saveProjectSpy).toHaveBeenCalled();
}

function shouldNotSave(maxScore: number) {
  setMaxScoreAndSave(maxScore);
  expect(getNodeSpy).not.toHaveBeenCalled();
  expect(saveProjectSpy).not.toHaveBeenCalled();
}

function setMaxScoreAndSave(maxScore: number) {
  component.maxScore = maxScore;
  component.saveMaxScore();
}
