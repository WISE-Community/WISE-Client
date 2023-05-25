import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentContent } from '../../../common/ComponentContent';
import { Component } from '../../../common/Component';
import { of } from 'rxjs';
import { NotebookService } from '../../../services/notebookService';

let component: ShowGroupWorkStudentComponent;
let fixture: ComponentFixture<ShowGroupWorkStudentComponent>;

class MockNotebookService {
  notebookUpdated$: any = of({});

  isNotebookEnabled() {
    return false;
  }
}

describe('ShowGroupWorkStudentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [ShowGroupWorkStudentComponent],
      providers: [{ provide: NotebookService, useClass: MockNotebookService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGroupWorkStudentComponent);
    component = fixture.componentInstance;
    const componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true
    } as ComponentContent;
    component.component = new Component(componentContent, null);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
