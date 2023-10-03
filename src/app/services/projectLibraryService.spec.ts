import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../assets/wise5/services/projectLibraryService';

let configService: ConfigService;
let http: HttpTestingController;
let service: ProjectLibraryService;

describe('ProjectLibraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectLibraryService, ConfigService]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProjectLibraryService);
    configService = TestBed.inject(ConfigService);
  });
  getLibraryProjects();
});

function getLibraryProjects() {
  describe('getLibraryProjects()', () => {
    it('gets the library projects, sorted and filtered', () => {
      const getLibraryProjectsURL = '/api/project/library';
      spyOn(configService, 'getConfigParam').and.callFake((param) => {
        return getLibraryProjectsURL;
      });
      const unit1 = { id: 1, name: 'one' };
      const unit2 = { id: 2, name: 'two' };
      const unit3 = { id: 3, name: 'three' };
      const libraryProjects = [
        {
          children: [unit3, unit1]
        },
        {
          children: [unit2, unit1]
        }
      ];
      service.getLibraryProjects().subscribe((projects) => {
        expect(projects).toEqual([unit3, unit2, unit1]);
      });
      http.expectOne(getLibraryProjectsURL).flush(libraryProjects);
    });
  });
}
