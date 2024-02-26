import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatableInputComponent } from './translatable-input.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

describe('TranslatableInputComponent', () => {
  let component: TranslatableInputComponent;
  let fixture: ComponentFixture<TranslatableInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule,
        TranslatableInputComponent
      ],
      providers: [TeacherProjectService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(TranslatableInputComponent);
    component = fixture.componentInstance;
    component.content = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
