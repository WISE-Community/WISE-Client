import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentStudent } from './component-student.component';
import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { ProjectService } from '../services/projectService';
import { SessionService } from '../services/sessionService';
import { StudentAssetService } from '../services/studentAssetService';
import { StudentDataService } from '../services/studentDataService';
import { TagService } from '../services/tagService';
import { UtilService } from '../services/utilService';
import { ComponentService } from './componentService';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let component: ComponentStudent;
let fixture: ComponentFixture<ComponentStudent>;

class MockService {}

@Component({
  selector: 'component-student-impl'
})
class ComponentStudentImpl extends ComponentStudent {}

describe('ComponentStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [ComponentStudentImpl],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockService },
        NotebookService,
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
  submit();
});

let performSubmitSpy;
function submit() {
  describe('submit()', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ComponentStudentImpl);
      component = fixture.componentInstance;
      component.componentContent = {};
      component.isSubmitDirty = true;
      spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue(
        null
      );
      spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(false);
      spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
      performSubmitSpy = spyOn(component, 'performSubmit');
    });
    submit_maxSubmitCountDoesNotExist_ShouldPerformSubmit();
    submit_maxSubmitCountNotReached_ShouldPerformSubmit();
    submit_maxSubmitCountReached_ShouldNotPerformSubmit();
  });
}

function submit_maxSubmitCountDoesNotExist_ShouldPerformSubmit() {
  it("should perform submit when maxSubmitCount doesn't exist", () => {
    spyOn(component, 'hasMaxSubmitCount').and.returnValue(false);
    fixture.detectChanges();
    component.submit('nodeSubmitButtonClicked');
    expect(performSubmitSpy).toHaveBeenCalledWith('nodeSubmitButtonClicked');
  });
}

function submit_maxSubmitCountNotReached_ShouldPerformSubmit() {
  it('should perform submit when maxSubmitCount is not reached', () => {
    spyOn(component, 'hasMaxSubmitCount').and.returnValue(true);
    spyOn(component, 'getNumberOfSubmitsLeft').and.returnValue(5);
    fixture.detectChanges();
    component.submit('nodeSubmitButtonClicked');
    expect(performSubmitSpy).toHaveBeenCalledWith('nodeSubmitButtonClicked');
  });
}

function submit_maxSubmitCountReached_ShouldNotPerformSubmit() {
  it('should not perform submit when maxSubmitCount is reached', () => {
    spyOn(component, 'hasMaxSubmitCount').and.returnValue(true);
    spyOn(component, 'getNumberOfSubmitsLeft').and.returnValue(0);
    fixture.detectChanges();
    component.submit('nodeSubmitButtonClicked');
    expect(performSubmitSpy).not.toHaveBeenCalledWith('nodeSubmitButtonClicked');
    expect(component.isSubmit).toEqual(false);
  });
}
