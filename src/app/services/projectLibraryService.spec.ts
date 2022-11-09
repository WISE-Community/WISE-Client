import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../assets/wise5/services/projectLibraryService';
import { UtilService } from '../../assets/wise5/services/utilService';

let configService: ConfigService;
let http: HttpTestingController;
let service: ProjectLibraryService;
const getLibraryProjectsURL = '/api/project/library';
const libraryProjects = [
  {
    children: [
      { id: 3, name: 'three' },
      { id: 1, name: 'one' }
    ]
  },
  {
    children: [
      { id: 2, name: 'two' },
      { id: 1, name: 'one' }
    ]
  }
];

describe('ProjectLibraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectLibraryService, ConfigService, UtilService]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProjectLibraryService);
    configService = TestBed.inject(ConfigService);
  });
  getLibraryProjects();
  sortAndFilterUniqueProjects();
  filterUniqueProjects();
});

function getLibraryProjects() {
  describe('getLibraryProjects', () => {
    it('should get the library projects', () => {
      spyOnLibraryProjectsURLFromConfig();
      const result = service.getLibraryProjects();
      http.expectOne(getLibraryProjectsURL).flush(libraryProjects);
      result.then((projects) => {
        expect(projects).toEqual(libraryProjects);
      });
    });
  });
}

function spyOnLibraryProjectsURLFromConfig() {
  spyOn(configService, 'getConfigParam').and.callFake((param) => {
    return getLibraryProjectsURL;
  });
}

function sortAndFilterUniqueProjects() {
  describe('sortAndFilterUniqueProjects', () => {
    it('should filter and sort unique projects', () => {
      const result = service.sortAndFilterUniqueProjects(libraryProjects);
      expect(result).toEqual([
        { id: 3, name: 'three' },
        { id: 2, name: 'two' },
        { id: 1, name: 'one' }
      ]);
    });
  });
}

function filterUniqueProjects() {
  describe('filterUniqueProjects', () => {
    it('should filter unique projects based on id', () => {
      const nonUniqueProjects = [
        { id: 3, name: 'three' },
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 1, name: 'one' }
      ];
      const uniqueProjects = service.filterUniqueProjects(nonUniqueProjects);
      expect(uniqueProjects.length).toEqual(3);
      expect(uniqueProjects[0].id).toEqual(3);
      expect(uniqueProjects[1].id).toEqual(1);
      expect(uniqueProjects[2].id).toEqual(2);
    });
  });
}
