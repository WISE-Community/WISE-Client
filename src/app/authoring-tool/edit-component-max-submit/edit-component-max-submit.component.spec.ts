import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponentMaxSubmitComponent } from './edit-component-max-submit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditComponentMaxSubmitComponent', () => {
  let component: EditComponentMaxSubmitComponent;
  let fixture: ComponentFixture<EditComponentMaxSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditComponentMaxSubmitComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentMaxSubmitComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
