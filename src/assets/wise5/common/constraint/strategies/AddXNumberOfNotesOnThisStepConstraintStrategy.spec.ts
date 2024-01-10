import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../../services/notebookService';
import { StudentDataService } from '../../../services/studentDataService';
import { AddXNumberOfNotesOnThisStepConstraintStrategy } from './AddXNumberOfNotesOnThisStepConstraintStrategy';

let dataService: StudentDataService;
let notebookService: NotebookService;
let strategy: AddXNumberOfNotesOnThisStepConstraintStrategy;

describe('AddXNumberOfNotesOnThisStepConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    notebookService = TestBed.inject(NotebookService);
    strategy = new AddXNumberOfNotesOnThisStepConstraintStrategy();
    strategy.dataService = dataService;
    strategy.notebookService = notebookService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        requiredNumberOfNotes: 2
      }
    };
    let notebook;
    beforeEach(() => {
      notebook = {
        allItems: [{ nodeId: 'node1' }, { nodeId: 'node2' }]
      };
    });
    it('should return false when there are not enough required number of notes', () => {
      expectEvaluate(criteria, notebook, false);
    });
    it('should return true when there are enough required number of notes', () => {
      notebook.allItems.forEach((item) => {
        item.nodeId = 'node1';
      });
      expectEvaluate(criteria, notebook, true);
    });
  });
}

function expectEvaluate(criteria: any, notebook: any, expectedValue: boolean): void {
  spyOn(notebookService, 'getNotebookByWorkgroup').and.returnValue(notebook);
  expect(strategy.evaluate(criteria)).toEqual(expectedValue);
}
