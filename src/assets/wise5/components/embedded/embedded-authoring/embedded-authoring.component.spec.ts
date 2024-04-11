import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedAuthoring } from './embedded-authoring.component';
import { EmbeddedAuthoringModule } from './embedded-authoring.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

let component: EmbeddedAuthoring;
let fixture: ComponentFixture<EmbeddedAuthoring>;

describe('EmbeddedAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EmbeddedAuthoringModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherNodeService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(EmbeddedAuthoring);
    component = fixture.componentInstance;
    const componentContent = {
      id: '86fel4wjm4',
      type: 'Embedded',
      prompt: '',
      showSaveButton: false,
      showSubmitButton: false,
      url: 'glucose.html',
      showAddToNotebookButton: true,
      width: null
    };
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
