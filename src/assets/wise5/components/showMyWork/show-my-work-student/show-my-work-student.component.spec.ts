import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../../services/annotationService';
import { NotebookService } from '../../../services/notebookService';

import { ShowMyWorkStudentComponent } from './show-my-work-student.component';

class MockService {}

class MockNotebookService {
  notebookUpdated$: any = of({});

  isNotebookEnabled() {
    return false;
  }
}

describe('ShowMyWorkStudentComponent', () => {
  let component: ShowMyWorkStudentComponent;
  let fixture: ComponentFixture<ShowMyWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatCardModule, StudentTeacherCommonServicesModule],
      declarations: [ShowMyWorkStudentComponent],
      providers: [
        { provide: MatDialog, useClass: MockService },
        { provide: NotebookService, useClass: MockNotebookService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMyWorkStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
