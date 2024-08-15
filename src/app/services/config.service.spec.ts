import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [ConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
