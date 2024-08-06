import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TagService } from '../../assets/wise5/services/tagService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let configService: ConfigService;
let projectService: ProjectService;
let http: HttpTestingController;
let service: TagService;

describe('TagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    http = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(TagService);
  });
  retrieveRunTags();
  getNextAvailableTag();
});

function retrieveRunTags() {
  it('should retrieve run tags', () => {
    const response = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' }
    ];
    service.retrieveRunTags().subscribe((data) => {
      expect(data).toEqual(response);
    });
    const req = http.expectOne(`/api/tag/run/${configService.getRunId()}`);
    expect(req.request.method).toEqual('GET');
    req.flush(response);
    expect(service.getTags()).toEqual(response);
  });
}

function getNextAvailableTag() {
  it('should get the next available tag', () => {
    const existingTags = [{ name: 'Group 1' }, { name: 'Group 2' }];
    spyOn(projectService, 'getTags').and.returnValue(existingTags);
    expect(service.getNextAvailableTag()).toEqual('Group 3');
  });
}
