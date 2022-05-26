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
import { MatDialogModule } from '@angular/material/dialog';

let component: ComponentStudent;
let fixture: ComponentFixture<ComponentStudent>;
let performSubmitSpy: jasmine.Spy;

class MockService {}

@Component({
  selector: 'component-student-impl'
})
class ComponentStudentImpl extends ComponentStudent {}

describe('ComponentStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
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
    fixture = TestBed.createComponent(ComponentStudentImpl);
    component = fixture.componentInstance;
    component.componentContent = {};
    component.isSubmitDirty = true;
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue(null);
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    performSubmitSpy = spyOn(component, 'performSubmit');
  });
  submit();
  isFromConnectedComponent();
});

function submit() {
  describe('submit()', () => {
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

function isFromConnectedComponent() {
  describe('isFromConnectedComponent()', () => {
    beforeEach(() => {
      component.componentContent.connectedComponents = [
        {
          nodeId: 'node2',
          componentId: 'component2'
        }
      ];
    });
    it('should check if work is from a connected component when it is', () => {
      const componentState = {
        nodeId: 'node2',
        componentId: 'component2'
      };
      expect(component.isFromConnectedComponent(componentState)).toEqual(true);
    });
    it('should check if work is from a connected component when it is not', () => {
      const componentState = {
        nodeId: 'node3',
        componentId: 'component3'
      };
      expect(component.isFromConnectedComponent(componentState)).toEqual(false);
    });
  });
}
