import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { MockProviders } from 'ng-mocks';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TranslatableInputComponent } from './translatable-input.component';

describe('TranslatableInputComponent', () => {
  let component: TranslatableInputComponent;
  let fixture: ComponentFixture<TranslatableInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslatableInputComponent],
      providers: [
        MockProviders(ConfigService, TeacherProjectService, TeacherProjectTranslationService)
      ]
    });
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(TranslatableInputComponent);
    component = fixture.componentInstance;
    component.content = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
