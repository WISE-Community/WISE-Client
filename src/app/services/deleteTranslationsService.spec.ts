import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { DeleteTranslationsService } from '../../assets/wise5/services/deleteTranslationsService';
import { ProjectLocale } from '../domain/projectLocale';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { ConfigService } from '../../assets/wise5/services/configService';

let configService: ConfigService;
let http: HttpTestingController;
let projectService: TeacherProjectService;
let service: DeleteTranslationsService;
describe('DeleteTranslationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      providers: [DeleteTranslationsService, TeacherProjectService],
      teardown: { destroyAfterEach: false }
    });
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(DeleteTranslationsService);
  });
  tryDeleteComponents();
});

function tryDeleteComponents() {
  describe('tryDeleteComponents()', () => {
    it('fetches all supported translations', () => {
      spyOn(projectService, 'getLocale').and.returnValue(
        new ProjectLocale({ default: 'en_us', supported: ['es', 'ja'] })
      );
      spyOn(configService, 'getProjectId').and.returnValue('123');
      spyOn(configService, 'getConfigParam').and.returnValue('/123/project.json');
      service.tryDeleteComponents([
        {
          id: 'abc',
          type: 'OpenResponse',
          prompt: 'hello',
          'prompt.i18n': { id: 'xyz' }
        } as ComponentContent
      ]);
      http.expectOne(`/123/translations.es.json`).flush({ xyz: {} });
      http.expectOne(`/123/translations.ja.json`).flush({ xyz: {} });
    });
  });
}
