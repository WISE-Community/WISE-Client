import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponentMaxSubmitComponent } from './edit-component-max-submit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditComponentMaxSubmitComponent', () => {
  let component: EditComponentMaxSubmitComponent;
  let fixture: ComponentFixture<EditComponentMaxSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponentMaxSubmitComponent],
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
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
