import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';
import { ComponentContent } from '../../../common/ComponentContent';
import { Component } from '../../../common/Component';
import { of } from 'rxjs';
import { NotebookService } from '../../../services/notebookService';
import { provideHttpClient } from '@angular/common/http';
import { MockComponent } from 'ng-mocks';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';

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
      imports: [
        ShowGroupWorkStudentComponent,
        MockComponent(ComponentHeaderComponent),
        StudentTeacherCommonServicesModule
      ],
      providers: [{ provide: NotebookService, useClass: MockNotebookService }, provideHttpClient()]
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
