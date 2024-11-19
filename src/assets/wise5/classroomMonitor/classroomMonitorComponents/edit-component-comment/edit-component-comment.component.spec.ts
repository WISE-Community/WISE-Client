import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../../services/annotationService';
import { EditComponentCommentComponent } from './edit-component-comment.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotificationService } from '../../../services/notificationService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let annotationService: AnnotationService;
let component: EditComponentCommentComponent;
let fixture: ComponentFixture<EditComponentCommentComponent>;
let notificationService: NotificationService;

describe('EditComponentCommentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EditComponentCommentComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [provideHttpClient(withInterceptorsFromDi())]
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
        expect(notificationShowSavedMessageSpy).toHaveBeenCalledWith('Saved comment');
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
