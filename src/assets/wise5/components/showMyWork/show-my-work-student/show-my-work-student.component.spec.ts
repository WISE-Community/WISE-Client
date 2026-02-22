import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ComponentContent } from '../../../common/ComponentContent';
import { NotebookService } from '../../../services/notebookService';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from '../../../services/projectService';

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
      imports: [StudentTeacherCommonServicesModule, ShowMyWorkStudentComponent],
      providers: [{ provide: NotebookService, useClass: MockNotebookService }, provideHttpClient()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMyWorkStudentComponent);
    component = fixture.componentInstance;
    const componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true
    } as ComponentContent;
    component.component = new Component(componentContent, null);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
