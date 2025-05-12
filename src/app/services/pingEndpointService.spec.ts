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

  it('should add to ping list iff item id is unique and for berkeley endpoint', () => {
    expect(getPingListSize()).toEqual(0);
    pingEndpointService.addItemToPingList('test');
    expect(getPingListSize()).toEqual(0);
    pingEndpointService.addItemToPingList('berkeley_test');
    expect(getPingListSize()).toEqual(1);
    pingEndpointService.addItemToPingList('berkeley_test');
    expect(getPingListSize()).toEqual(1);
  });

  it('should send pings to endpoint when startPinging() is called', () => {
    pingEndpointService.addItemToPingList('berkeley_test1');
    pingEndpointService.addItemToPingList('berkeley_test2');
    pingEndpointService.startPinging();
    expect(httpClientMock).toHaveBeenCalledTimes(2);
  });

  it('should wait before sending another ping', fakeAsync(() => {
    pingEndpointService.addItemToPingList('berkeley_test1');
    pingEndpointService.addItemToPingList('berkeley_test2');
    pingEndpointService.startPinging();
    tick(294999);
    expect(httpClientMock).toHaveBeenCalledTimes(2);
    tick(2);
    expect(httpClientMock).toHaveBeenCalledTimes(4);
  }));

  it('should stop trying to ping when stopPinging()', fakeAsync(() => {
    pingEndpointService.addItemToPingList('berkeley_test1');
    pingEndpointService.addItemToPingList('berkeley_test2');
    pingEndpointService.startPinging();
    expect(httpClientMock).toHaveBeenCalledTimes(2);
    pingEndpointService.stopPinging();
    tick(500000);
    expect(httpClientMock).toHaveBeenCalledTimes(2);
  }));
});

function getPingListSize(): number {
  return [...pingEndpointService['pingList']].length;
}
