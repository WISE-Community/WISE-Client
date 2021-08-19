import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { AnnotationService } from '../../../services/annotationService';
import { EditComponentCommentComponent } from './edit-component-comment.component';

class MockAnnotationService {
  createAnnotation() {}
  saveAnnotation() {}
}

let annotationService;
let component: EditComponentCommentComponent;
let fixture: ComponentFixture<EditComponentCommentComponent>;

describe('EditComponentCommentComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [EditComponentCommentComponent],
      providers: [{ provide: AnnotationService, useClass: MockAnnotationService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    annotationService = TestBed.inject(AnnotationService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  saveComment();
});

function saveComment() {
  describe('saveComment()', () => {
    it('should create and save annotation', () => {
      const createAnnotationSpy = spyOn(
        annotationService,
        'createAnnotation'
      ).and.callFake(() => {});
      const saveAnnotationSpy = spyOn(annotationService, 'saveAnnotation').and.callFake(() => {
        return new Promise(() => {});
      });
      component.saveComment();
      expect(createAnnotationSpy).toHaveBeenCalled();
      expect(saveAnnotationSpy).toHaveBeenCalled();
    });
  });
}
