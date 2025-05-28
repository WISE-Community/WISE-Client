import { HttpClient } from '@angular/common/http';
import { CRaterPingService } from '../../assets/wise5/services/cRaterPingService';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

let cRaterPingService: CRaterPingService;
let httpClientMock: jasmine.Spy;
const testId = 'berkeley_test_id';

describe('CRaterPingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient), CRaterPingService]
    });
    cRaterPingService = TestBed.inject(CRaterPingService);
    httpClientMock = spyOn(TestBed.inject(HttpClient), 'post').and.returnValue(of({}));
  });

  it('should send ping to endpoint when startPinging() is called', () => {
    cRaterPingService.startPinging(testId);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
  });

  it('should wait before sending another ping', fakeAsync(() => {
    cRaterPingService.startPinging(testId);
    tick(294999);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    tick(2);
    expect(httpClientMock).toHaveBeenCalledTimes(2);
  }));

  it('should stop trying to ping when stopPinging()', fakeAsync(() => {
    cRaterPingService.startPinging(testId);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    cRaterPingService.stopPinging(testId);
    tick(500000);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
  }));
});
