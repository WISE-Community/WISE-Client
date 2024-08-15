import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatableRichTextEditorComponent } from './translatable-rich-text-editor.component';
import { ConfigService } from '../../../services/configService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

describe('TranslatableRichTextEditorComponent', () => {
  let component: TranslatableRichTextEditorComponent;
  let fixture: ComponentFixture<TranslatableRichTextEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule,
        TranslatableRichTextEditorComponent
      ],
      providers: [ConfigService, TeacherProjectTranslationService, TeacherProjectService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(TranslatableRichTextEditorComponent);
    component = fixture.componentInstance;
    component.content = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
