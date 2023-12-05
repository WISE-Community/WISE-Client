import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { TranslateProjectService } from '../../assets/wise5/services/translateProjectService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ProjectLocale } from '../domain/projectLocale';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { copy } from '../../assets/wise5/common/object/object';
import { ConfigService } from '../../assets/wise5/services/configService';

let http: HttpTestingController;
let demoProjectJSON: any;
let configService: ConfigService;
let projectService: ProjectService;
let service: TranslateProjectService;
describe('TranslateProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    http = TestBed.inject(HttpTestingController);
    demoProjectJSON = copy(demoProjectJSON_import);
    configService = TestBed.inject(ConfigService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(TranslateProjectService);
    spyOn(projectService, 'getOriginalProject').and.returnValue(demoProjectJSON);
  });
  describe('translate()', () => {
    describe('has no translations to apply', () => {
      beforeEach(() => {
        spyOn(projectService, 'getLocale').and.returnValue(
          new ProjectLocale({ default: 'en_US', supported: [] })
        );
      });
      it('should keep original project in tact', () => {
        service.translate().then(() => {
          expect(projectService.getProjectTitle()).toEqual('Demo Project');
        });
      });
    });
    describe('has translations to apply', () => {
      beforeEach(() => {
        spyOn(projectService, 'getLocale').and.returnValue(
          new ProjectLocale({ default: 'en_US', supported: ['es'] })
        );
        spyOn(configService, 'getConfigParam').and.returnValue('/123/project.json');
      });
      it('should retrieve translation mapping file and translate project', () => {
        service.translate('es').then(() => {
          expect(projectService.getProjectTitle()).toEqual('Proyecto de demostración');
        });
        http
          .expectOne('/123/project.es.json')
          .flush({ d66d3be571e16cf8d0166286a0a632ec: 'Proyecto de demostración' });
      });
    });
  });
});
