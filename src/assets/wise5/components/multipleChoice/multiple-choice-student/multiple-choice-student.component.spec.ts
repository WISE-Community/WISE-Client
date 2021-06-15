import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { MultipleChoiceService } from '../multipleChoiceService';
import { MultipleChoiceStudent } from './multiple-choice-student.component';

class MockService {}
class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

const choiceId1 = 'choice1';
const choiceId2 = 'choice2';
const choiceId3 = 'choice3';
const choiceText1 = 'A';
const choiceText2 = 'B';
const choiceText3 = 'C<br/><img src="cookie.png"/>';
let component: MultipleChoiceStudent;
const componentId = 'component1';
const feedback1 = 'Good job';
const feedback2 = 'This is not A, this is B';
const feedback3 = 'This is not A, this is C';
let fixture: ComponentFixture<MultipleChoiceStudent>;
const nodeId = 'node1';
let originalComponentContent;

describe('MultipleChoiceStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [MultipleChoiceStudent],
      providers: [
        AnnotationService,
        MultipleChoiceService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    originalComponentContent = {
      id: componentId,
      type: 'MultipleChoice',
      prompt: 'Choose A',
      choices: [
        createComponentContentChoice(choiceId1, choiceText1, feedback1, true),
        createComponentContentChoice(choiceId2, choiceText2, feedback2, false),
        createComponentContentChoice(choiceId3, choiceText3, feedback3, false)
      ]
    };
    component.componentContent = JSON.parse(JSON.stringify(originalComponentContent));
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  getChoiceById();
});

function createComponentContentChoice(
  id: string,
  text: string,
  feedback: string,
  isCorrect: boolean
): any {
  return {
    id: id,
    text: text,
    feedback: feedback,
    isCorrect: isCorrect
  };
}

function getChoiceById() {
  describe('getChoiceById', () => {
    it('should get choice by id', () => {
      component.componentContent = TestBed.inject(ProjectService).injectClickToSnipImage(
        component.componentContent
      );
      expect(component.componentContent.choices[2].text).toContain('onclick');
      expect(component.getChoiceById(originalComponentContent, choiceId1).text).toEqual(
        choiceText1
      );
      expect(component.getChoiceById(originalComponentContent, choiceId2).text).toEqual(
        choiceText2
      );
      expect(component.getChoiceById(originalComponentContent, choiceId3).text).toEqual(
        choiceText3
      );
    });
  });
}
