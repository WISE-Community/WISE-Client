import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';

import { EditComponentAddToNotebookButtonComponent } from './edit-component-add-to-notebook-button.component';

describe('EditComponentAddToNotebookButtonComponent', () => {
  let component: EditComponentAddToNotebookButtonComponent;
  let fixture: ComponentFixture<EditComponentAddToNotebookButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditComponentAddToNotebookButtonComponent],
      providers: [TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentAddToNotebookButtonComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
