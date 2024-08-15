import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../../services/annotationService';
import { EditComponentScoreComponent } from './edit-component-score.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotificationService } from '../../../services/notificationService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let annotationService: AnnotationService;
let component: EditComponentScoreComponent;
let fixture: ComponentFixture<EditComponentScoreComponent>;
let notificationService: NotificationService;

describe('EditComponentScoreComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [EditComponentScoreComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    annotationService = TestBed.inject(AnnotationService);
    notificationService = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(EditComponentScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  ngOnInit();
  saveScore();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    ngOnInit_latestAnnotationNull_SetScoreTo0();
    ngOnInit_latestAnnotationSet_SetScoreFromAnnotation();
  });
}

function ngOnInit_latestAnnotationNull_SetScoreTo0() {
  it('sets score to 0 when latestAnnotationScore is not set', () => {
    component.ngOnInit();
    expect(component.score).toEqual(0);
  });
}

function ngOnInit_latestAnnotationSet_SetScoreFromAnnotation() {
  it('sets score to latestAnnotation.score', () => {
    component.latestAnnotationScore = { data: { value: 5 } };
    component.ngOnInit();
    expect(component.score).toEqual(5);
  });
}

function saveScore() {
  describe('saveScore()', () => {
    it('creates and saves annotation', async () => {
      const score = 5;
      const annotation = createAnnotation(score);
      const createAnnotationSpy = spyOn(annotationService, 'createAnnotation').and.callFake(() => {
        return annotation;
      });
      const saveAnnotationSpy = spyOn(annotationService, 'saveAnnotation').and.callFake(() =>
        Promise.resolve()
      );
      const notificationShowSavedMessageSpy = spyOn(notificationService, 'showSavedMessage');
      component.saveScore(score);
      expect(createAnnotationSpy).toHaveBeenCalled();
      expect(saveAnnotationSpy).toHaveBeenCalledWith(annotation);
      fixture.whenStable().then(() => {
        expect(notificationShowSavedMessageSpy).toHaveBeenCalledWith('Saved score');
      });
    });
  });
}

function createAnnotation(value: number): any {
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
    type: 'score',
    data: { value: value },
    clientSaveTime: null
  };
}
