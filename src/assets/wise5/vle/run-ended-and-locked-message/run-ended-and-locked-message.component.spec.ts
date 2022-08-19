import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../services/configService';
import { RunEndedAndLockedMessageComponent } from './run-ended-and-locked-message.component';

class MockConfigService {
  getPrettyEndDate(): string {
    return 'August 19, 2022';
  }
}

describe('RunEndedAndLockedMessageComponent', () => {
  let component: RunEndedAndLockedMessageComponent;
  let configService: ConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RunEndedAndLockedMessageComponent,
        { provide: ConfigService, useClass: MockConfigService }
      ]
    });
    component = TestBed.inject(RunEndedAndLockedMessageComponent);
    configService = TestBed.inject(ConfigService);
  });
  it('should not have message after construction', () => {
    expect(component.message).toBeUndefined();
  });
  it('should set message after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.message).toEqual(
      'This unit ended on August 19, 2022. You can no longer save new work.'
    );
  });
});
