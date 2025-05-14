import { HttpClient } from '@angular/common/http';
import { PingEndpointService } from '../../assets/wise5/services/pingEndpointService';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

let pingEndpointService: PingEndpointService;
let httpClientMock: jasmine.Spy;
const testId = 'berkeley_test_id';

fdescribe('PingEndpointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MockProvider(HttpClient), PingEndpointService]
    });
    pingEndpointService = TestBed.inject(PingEndpointService);
    httpClientMock = spyOn(TestBed.inject(HttpClient), 'post').and.returnValue(of({}));
  });

  it('should send ping to endpoint when startPinging() is called', () => {
    pingEndpointService.startPinging(testId);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
  });

  it('should wait before sending another ping', fakeAsync(() => {
    pingEndpointService.startPinging(testId);
    tick(294999);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    tick(2);
    expect(httpClientMock).toHaveBeenCalledTimes(2);
  }));

  it('should stop trying to ping when stopPinging()', fakeAsync(() => {
    pingEndpointService.startPinging(testId);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    pingEndpointService.stopPinging(testId);
    tick(500000);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
  }));
});
