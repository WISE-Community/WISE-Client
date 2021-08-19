import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { AnnotationService } from '../../../services/annotationService';
import { EditComponentScoreComponent } from './edit-component-score.component';

class MockAnnotationService {
  createAnnotation() {}
  saveAnnotation() {}
}

let annotationService;
let component: EditComponentScoreComponent;
let fixture: ComponentFixture<EditComponentScoreComponent>;

describe('EditComponentScoreComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [EditComponentScoreComponent],
      providers: [{ provide: AnnotationService, useClass: MockAnnotationService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    annotationService = TestBed.inject(AnnotationService);
  });
  beforeEach(() => {
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
  it('should set score to 0 when latestAnnotationScore is not set', () => {
    component.ngOnInit();
    expect(component.score).toEqual(0);
  });
}

function ngOnInit_latestAnnotationSet_SetScoreFromAnnotation() {
  it('should set score to latestAnnotation.score', () => {
    component.latestAnnotationScore = { data: { value: 5 } };
    component.ngOnInit();
    expect(component.score).toEqual(5);
  });
}

function saveScore() {
  describe('saveScore()', () => {
    it('should create and save annotation', () => {
      const createAnnotationSpy = spyOn(
        annotationService,
        'createAnnotation'
      ).and.callFake(() => {});
      const saveAnnotationSpy = spyOn(annotationService, 'saveAnnotation').and.callFake(() => {});
      component.saveScore(5);
      expect(createAnnotationSpy).toHaveBeenCalled();
      expect(saveAnnotationSpy).toHaveBeenCalled();
    });
  });
}
