import { ConfigService } from './config.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { LogOutService } from './logOutService';
import { MockProviders } from 'ng-mocks';
import { of } from 'rxjs';

let service: LogOutService;
let httpSpy: jasmine.Spy;
export class MockConfigService {}

fdescribe('LogOutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LogOutService, MockProviders(ConfigService, HttpClient)]
    });
    service = TestBed.inject(LogOutService);
    httpSpy = spyOn(TestBed.inject(HttpClient), 'get').and.returnValue(of({}));
    spyOn(TestBed.inject(ConfigService), 'getConfig').and.returnValue(
      of({ contextPath: '', logOutURL: 'api/logOutUrl', currentTime: 0 })
    );
  });

  it('should make a GET request to the log out URL when logOut() is called', fakeAsync(() => {
    service.logOut();
    tick();
    expect(httpSpy).toHaveBeenCalledWith('api/logOutUrl');
  }));
});
