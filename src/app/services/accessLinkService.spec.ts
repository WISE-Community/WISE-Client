import { AccessLinkService } from './accessLinkService';
import { ConfigService } from './config.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MockProviders } from 'ng-mocks';

let service: AccessLinkService;
export class MockConfigService {}

describe('AccessLinkService', () => {
  const linkBase = 'wise.berkeley.edu/api/survey/launch/dog1234-';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AccessLinkService, MockProviders(ConfigService, HttpClient)]
    });
    service = TestBed.inject(AccessLinkService);
    spyOn(TestBed.inject(ConfigService), 'getContextPath').and.returnValue('wise.berkeley.edu');
  });

  it('should get access links', () => {
    const accessLinks = service.getAccessLinks('dog1234', ['1', 'test', 'this is a test']);
    expect(accessLinks[0]).toEqual(linkBase + '1');
    expect(accessLinks[1]).toEqual(linkBase + 'test');
    expect(accessLinks[2]).toEqual(linkBase + 'this++is++a++test');
  });

  it('should get period from access link', () => {
    expect(service.getPeriodFromAccessLink(linkBase + '1')).toEqual('1');
    expect(service.getPeriodFromAccessLink(linkBase + 'test')).toEqual('test');
    expect(service.getPeriodFromAccessLink(linkBase + 'this++is++a++test')).toEqual(
      'this is a test'
    );
  });
});
