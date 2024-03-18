import { TestBed } from '@angular/core/testing';
import { EditProjectTranslationService } from '../../assets/wise5/services/editProjectTranslationService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { signal } from '@angular/core';
import { ProjectService } from '../../assets/wise5/services/projectService';

class ConfigServiceStub {
  getProjectId() {
    return 1;
  }
}

class TeacherProjectServiceStub {
  readonly currentLanguage = signal({
    language: 'Spanish',
    locale: 'es'
  });
}

let http: HttpTestingController;
let projectService: TeacherProjectService;
let service: EditProjectTranslationService;
describe('EditProjectTranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditProjectTranslationService,
        HttpClientTestingModule,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ProjectService, useClass: TeacherProjectServiceStub },
        { provide: TeacherProjectService, useClass: TeacherProjectServiceStub }
      ],
      imports: [HttpClientTestingModule]
    });
    http = TestBed.inject(HttpTestingController);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(EditProjectTranslationService);
  });
  describe('saveCurrentTranslations()', () => {
    it('makes a POST request to backend', () => {
      service.saveCurrentTranslations({}).subscribe();
      const request = http.expectOne(`/api/author/project/translate/1/es`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual({});
    });
  });
});
