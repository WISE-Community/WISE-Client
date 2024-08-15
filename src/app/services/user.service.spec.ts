import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: UserService;
let http: HttpTestingController;
export class MockConfigService {}

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [UserService, { provide: ConfigService, useClass: MockConfigService }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });
  unlinkGoogleAccount_postToUrl();
});

function unlinkGoogleAccount_postToUrl() {
  it('unlinkGoogleAccount() should make POST request to unlink google account', fakeAsync(() => {
    const newPassword = 'my new pass';
    service.unlinkGoogleUser(newPassword).subscribe();
    const unlinkRequest = http.expectOne({
      url: '/api/google-user/unlink-account',
      method: 'POST'
    });
    unlinkRequest.flush({ response: 'success' });
    tick();
  }));
}
