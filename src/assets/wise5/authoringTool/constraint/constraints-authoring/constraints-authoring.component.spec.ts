// @ts-nocheck
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConstraintsAuthoringComponent } from './constraints-authoring.component';

let component: ConstraintsAuthoringComponent;
let fixture: ComponentFixture<ConstraintsAuthoringComponent>;
const nodeId1 = 'node1';

@Component({
  selector: 'constraints-authoring-component'
})
class ConstraintsAuthoringComponentImpl extends ConstraintsAuthoringComponent {}

describe('ConstraintsAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [ConstraintsAuthoringComponentImpl],
      providers: [TeacherProjectService]
    });
    fixture = TestBed.createComponent(ConstraintsAuthoringComponentImpl);
    component = fixture.componentInstance;
    component.content = {
      id: nodeId1,
      constraints: []
    };
  });

  addConstraint();
  deleteConstraint();
});

function addConstraint() {
  describe('addConstraint', () => {
    it('should add a constraint', () => {
      expect(component.content.constraints.length).toEqual(0);
      component.addConstraint();
      expect(component.content.constraints.length).toEqual(1);
      expect(component.content.constraints[0].id).toEqual(`${nodeId1}Constraint1`);
    });
  });
}

function deleteConstraint() {
  describe('deleteConstraint', () => {
    it('should delete a constraint', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.addConstraint();
      expect(component.content.constraints.length).toEqual(1);
      component.deleteConstraint(0);
      expect(component.content.constraints.length).toEqual(0);
    });
  });
}
