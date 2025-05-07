import { PingEndpointService } from '../../assets/wise5/services/pingEndpointService';
import { TestBed, inject } from '@angular/core/testing';

let pingEndpointService: PingEndpointService;
describe('PingEndpointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PingEndpointService]
    });
    pingEndpointService = TestBed.inject(PingEndpointService);
  });

  it('should send ping to endpoint when startPinging() is called', () => {});

  it('should wait 5 minutes before sending another ping', () => {});

  it('should stop trying to ping when stopPinging()', () => {});
});
