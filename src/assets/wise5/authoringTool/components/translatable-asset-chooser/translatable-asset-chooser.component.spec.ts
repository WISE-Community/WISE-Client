import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatableAssetChooserComponent } from './translatable-asset-chooser.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatDialogModule } from '@angular/material/dialog';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

describe('TranslatableAssetChooserComponent', () => {
  let component: TranslatableAssetChooserComponent;
  let fixture: ComponentFixture<TranslatableAssetChooserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        StudentTeacherCommonServicesModule,
        TranslatableAssetChooserComponent
      ],
      providers: [EditProjectTranslationService, TeacherProjectService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(TranslatableAssetChooserComponent);
    component = fixture.componentInstance;
    component.content = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
