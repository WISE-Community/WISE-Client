import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { StudentService } from './student.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StudentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [StudentService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', waitForAsync(
    inject(
      [StudentService, HttpTestingController],
      (service: StudentService, backend: HttpTestingController) => {
        expect(service).toBeTruthy();
      }
    )
  ));
});
