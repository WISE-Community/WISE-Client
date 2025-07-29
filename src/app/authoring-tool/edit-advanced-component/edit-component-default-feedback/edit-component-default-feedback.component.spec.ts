import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { EditComponentDefaultFeedback } from './edit-component-default-feedback.component';
import { MockProvider } from 'ng-mocks';

let component: EditComponentDefaultFeedback;
let feedback1 = 'First feedback';
let feedback2 = 'Second feedback';
let feedback3 = 'Third feedback';
let fixture: ComponentFixture<EditComponentDefaultFeedback>;
describe('EditComponentDefaultFeedback', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditComponentDefaultFeedback],
      providers: [MockProvider(TeacherProjectService)]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentDefaultFeedback);
    component = fixture.componentInstance;
    component.componentContent = {
      defaultFeedback: [feedback1, feedback2, feedback3]
    };
    fixture.detectChanges();
  });

  addDefaultFeedback();
  moveDefaultFeedbackUp();
  moveDefaultFeedbackDown();
  deleteDefaultFeedback();
});

function addDefaultFeedback() {
  describe('addDefaultFeedback', () => {
    it('should add a default feedback when there is no existing default feedback', () => {
      delete component.componentContent.defaultFeedback;
      expect(component.componentContent.defaultFeedback).toBeUndefined();
      component.addDefaultFeedback();
      expect(component.componentContent.defaultFeedback).not.toBeNull();
      expectArrayEquals(component.componentContent.defaultFeedback, ['']);
    });
    it('should add a default feedback when there is existing default feedback', () => {
      component.addDefaultFeedback();
      expectArrayEquals(component.componentContent.defaultFeedback, [
        feedback1,
        feedback2,
        feedback3,
        ''
      ]);
    });
  });
}

function moveDefaultFeedbackUp() {
  describe('moveDefaultFeedbackUp', () => {
    it('should move a default feedback up', () => {
      component.moveDefaultFeedbackUp(1);
      expectArrayEquals(component.componentContent.defaultFeedback, [
        feedback2,
        feedback1,
        feedback3
      ]);
    });
  });
}

function moveDefaultFeedbackDown() {
  describe('moveDefaultFeedbackUp', () => {
    it('should move a default feedback down', () => {
      component.moveDefaultFeedbackDown(1);
      expectArrayEquals(component.componentContent.defaultFeedback, [
        feedback1,
        feedback3,
        feedback2
      ]);
    });
  });
}

function deleteDefaultFeedback() {
  describe('deleteDefaultFeedback', () => {
    it('should delete a default feedback', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteDefaultFeedback(1);
      expectArrayEquals(component.componentContent.defaultFeedback, [feedback1, feedback3]);
    });
  });
}

function expectArrayEquals(a: string[], b: string[]): void {
  expect(a.length).toEqual(b.length);
  a.forEach((val, index) => {
    expect(val).toEqual(b[index]);
  });
}
