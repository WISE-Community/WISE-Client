import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedAuthoring } from './embedded-authoring.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { MockComponents } from 'ng-mocks';
import { TranslatableTextareaComponent } from '../../../authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';

let component: EmbeddedAuthoring;
let fixture: ComponentFixture<EmbeddedAuthoring>;
describe('EmbeddedAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmbeddedAuthoring,
        StudentTeacherCommonServicesModule,
        MockComponents(TranslatableTextareaComponent, TranslatableAssetChooserComponent)
      ],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
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
