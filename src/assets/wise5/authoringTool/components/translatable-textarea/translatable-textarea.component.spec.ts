import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatableTextareaComponent } from './translatable-textarea.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';

describe('TranslatableTextareaComponent', () => {
  let component: TranslatableTextareaComponent;
  let fixture: ComponentFixture<TranslatableTextareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule,
        TranslatableTextareaComponent
      ],
      providers: [EditProjectTranslationService, TeacherProjectService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(TranslatableTextareaComponent);
    component = fixture.componentInstance;
    component.content = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
