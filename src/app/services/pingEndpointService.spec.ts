import { HttpClient } from '@angular/common/http';
import { Component } from '../../assets/wise5/common/Component';
import { PingEndpointService } from '../../assets/wise5/services/pingEndpointService';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { DialogGuidanceComponent } from '../../assets/wise5/components/dialogGuidance/DialogGuidanceComponent';
import { DialogGuidanceContent } from '../../assets/wise5/components/dialogGuidance/DialogGuidanceContent';
import { of } from 'rxjs';

let pingEndpointService: PingEndpointService;
let httpClientMock: jasmine.Spy;
let component: Component;

describe('PingEndpointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MockProvider(HttpClient), PingEndpointService]
    });
    pingEndpointService = TestBed.inject(PingEndpointService);
    httpClientMock = spyOn(TestBed.inject(HttpClient), 'post').and.returnValue(of({}));

    const dgContent: DialogGuidanceContent = {
      computerAvatarSettings: { ids: [], label: 'l', prompt: 'p', initialResponse: 'i' },
      feedbackRules: [],
      id: 'id',
      isComputerAvatarEnabled: false,
      itemId: 'itemId',
      type: 'DialogGuidance'
    };
    component = new DialogGuidanceComponent(dgContent, 'nodeId');
  });

  it('should send ping to endpoint when startPinging() is called', () => {
    pingEndpointService.startPinging(component);
    expect(httpClientMock).toHaveBeenCalled();
  });

  it('should wait before sending another ping', fakeAsync(() => {
    pingEndpointService.startPinging(component);
    tick(294999);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    tick(2);
    expect(httpClientMock).toHaveBeenCalledTimes(2);
  }));

  it('should stop trying to ping when stopPinging()', fakeAsync(() => {
    pingEndpointService.startPinging(component);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    pingEndpointService.stopPinging();
    tick(500000);
    expect(httpClientMock).toHaveBeenCalledTimes(1);
  }));
});
