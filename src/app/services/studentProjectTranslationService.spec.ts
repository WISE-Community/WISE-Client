import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { StudentProjectTranslationService } from '../../assets/wise5/services/studentProjectTranslationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ProjectLocale } from '../domain/projectLocale';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { copy } from '../../assets/wise5/common/object/object';
import { ConfigService } from '../../assets/wise5/services/configService';

let http: HttpTestingController;
let demoProjectJSON: any;
let configService: ConfigService;
let dataService: StudentDataService;
let projectService: ProjectService;
let service: StudentProjectTranslationService;
describe('StudentProjectTranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      providers: [
        {
          provide: StudentDataService,
          useValue: jasmine.createSpyObj('StudentDataService', ['saveVLEEvent', 'getCurrentNodeId'])
        }
      ]
    });
    http = TestBed.inject(HttpTestingController);
    demoProjectJSON = copy(demoProjectJSON_import);
    configService = TestBed.inject(ConfigService);
    dataService = TestBed.inject(StudentDataService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(StudentProjectTranslationService);
    spyOn(projectService, 'getOriginalProject').and.returnValue(demoProjectJSON);
  });
  describe('switchLanguage()', () => {
    describe('has no translations to apply', () => {
      beforeEach(() => {
        spyOn(projectService, 'getLocale').and.returnValue(
          new ProjectLocale({ default: 'en_US', supported: [] })
        );
        spyOn(projectService, 'setCurrentLanguage').and.stub();
        spyOn(configService, 'isRunActive').and.returnValue(true);
      });
      it('should keep original project in tact', () => {
        service.switchLanguage({ language: 'Japanese', locale: 'ja' }, 'student').then(() => {
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
        service.switchLanguage({ language: 'Spanish', locale: 'es' }, 'student').then(() => {
          expect(projectService.getProjectTitle()).toEqual('Proyecto de demostración');
          http.expectOne('/123/translations.es.json').flush({
            d66d3be571e16cf8d0166286a0a632ec: { value: 'Proyecto de demostración', modified: 456 }
          });
        });
      });
    });
  });
});
