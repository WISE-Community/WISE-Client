import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';

import { EditComponentAddToNotebookButtonComponent } from './edit-component-add-to-notebook-button.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditComponentAddToNotebookButtonComponent', () => {
  let component: EditComponentAddToNotebookButtonComponent;
  let fixture: ComponentFixture<EditComponentAddToNotebookButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditComponentAddToNotebookButtonComponent],
    imports: [FormsModule,
        MatCheckboxModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
