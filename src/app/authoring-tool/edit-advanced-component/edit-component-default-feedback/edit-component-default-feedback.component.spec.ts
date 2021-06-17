import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { CopyNodesService } from '../../../../assets/wise5/services/copyNodesService';
import { SessionService } from '../../../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../../assets/wise5/services/utilService';
import { EditComponentDefaultFeedback } from './edit-component-default-feedback.component';

let component: EditComponentDefaultFeedback;
let feedback1 = 'First feedback';
let feedback2 = 'Second feedback';
let feedback3 = 'Third feedback';
let fixture: ComponentFixture<EditComponentDefaultFeedback>;

describe('EditComponentDefaultFeedback', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        UpgradeModule
      ],
      declarations: [EditComponentDefaultFeedback],
      providers: [
        ConfigService,
        CopyNodesService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentDefaultFeedback);
    component = fixture.componentInstance;
    component.authoringComponentContent = {
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
      delete component.authoringComponentContent.defaultFeedback;
      expect(component.authoringComponentContent.defaultFeedback).toBeUndefined();
      component.addDefaultFeedback();
      expect(component.authoringComponentContent.defaultFeedback).not.toBeNull();
      expectArrayEquals(component.authoringComponentContent.defaultFeedback, ['']);
    });
    it('should add a default feedback when there is existing default feedback', () => {
      component.addDefaultFeedback();
      expectArrayEquals(component.authoringComponentContent.defaultFeedback, [
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
      expectArrayEquals(component.authoringComponentContent.defaultFeedback, [
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
      expectArrayEquals(component.authoringComponentContent.defaultFeedback, [
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
      expectArrayEquals(component.authoringComponentContent.defaultFeedback, [
        feedback1,
        feedback3
      ]);
    });
  });
}

function expectArrayEquals(a: string[], b: string[]): void {
  expect(a.length).toEqual(b.length);
  a.forEach((val, index) => {
    expect(val).toEqual(b[index]);
  });
}
