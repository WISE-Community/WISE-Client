import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../../services/annotationService';
import { EditComponentCommentComponent } from './edit-component-comment.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '../../../services/notificationService';

let annotationService: AnnotationService;
let component: EditComponentCommentComponent;
let fixture: ComponentFixture<EditComponentCommentComponent>;
let notificationService: NotificationService;

describe('EditComponentCommentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponentCommentComponent],
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    annotationService = TestBed.inject(AnnotationService);
    notificationService = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(EditComponentCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  saveComment();
});

function saveComment() {
  describe('saveComment()', () => {
    it('creates and saves annotation', async () => {
      const commentText = 'Good job.';
      const annotation = createAnnotation(commentText);
      const createAnnotationSpy = spyOn(annotationService, 'createAnnotation').and.callFake(() => {
        return annotation;
      });
      const saveAnnotationSpy = spyOn(annotationService, 'saveAnnotation').and.returnValue(
        Promise.resolve()
      );
      const notificationShowSavedMessageSpy = spyOn(notificationService, 'showSavedMessage');
      component.saveComment(commentText);
      expect(createAnnotationSpy).toHaveBeenCalled();
      expect(saveAnnotationSpy).toHaveBeenCalledWith(annotation);
      fixture.whenStable().then(() => {
        expect(notificationShowSavedMessageSpy).toHaveBeenCalledWith('Saved Comment');
      });
    });
  });
}

function createAnnotation(value: string): any {
  return {
    id: null,
    runId: null,
    periodId: null,
    fromWorkgroupId: null,
    toWorkgroupId: null,
    nodeId: null,
    componentId: null,
    studentWorkId: null,
    localNotebookItemId: null,
    notebookItemId: null,
    type: 'comment',
    data: { value: value },
    clientSaveTime: null
  };
}
