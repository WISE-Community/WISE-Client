import { TestBed } from '@angular/core/testing';
import { RegisterProjectService } from '../../assets/wise5/services/registerProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

let http: HttpTestingController;
let service: RegisterProjectService;
describe('RegisterProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegisterProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RegisterProjectService);
  });
  register();
});

function register() {
  describe('register()', () => {
    it('should make a post request to register endpoint', () => {
      const newProjectIdExpected = 1;
      service.register('test', '{}').subscribe((actualProjectId) => {
        expect(actualProjectId);
      });
      http.expectOne('/api/author/project/new').flush(newProjectIdExpected);
    });
  });
}
