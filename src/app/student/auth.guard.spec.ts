import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';
import { UserService } from '../services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../services/config.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MockUserService {}

export class MockConfigService {}

describe('StudentAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule],
    providers: [
        AuthGuard,
        { provide: UserService, useClass: MockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should create', inject([AuthGuard, UserService, ConfigService], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
