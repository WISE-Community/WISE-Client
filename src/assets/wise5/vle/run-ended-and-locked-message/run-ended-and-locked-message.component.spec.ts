import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../services/configService';
import { RunEndedAndLockedMessageComponent } from './run-ended-and-locked-message.component';
import { By } from '@angular/platform-browser';

class MockConfigService {
  getPrettyEndDate(): string {
    return 'August 19, 2022';
  }
}

describe('RunEndedAndLockedMessageComponent', () => {
  let component: RunEndedAndLockedMessageComponent;
  let configService: ConfigService;
  let fixture: ComponentFixture<RunEndedAndLockedMessageComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RunEndedAndLockedMessageComponent],
      providers: [{ provide: ConfigService, useClass: MockConfigService }]
    });
    fixture = TestBed.createComponent(RunEndedAndLockedMessageComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfigService);
  });
  it('should not have message after construction', () => {
    expect(getTitle()).toEqual('');
  });
  it('should set message after Angular calls ngOnInit', () => {
    fixture.detectChanges();
    expect(getTitle()).toEqual(
      'This unit ended on August 19, 2022. You can no longer save new work.'
    );
  });
  function getTitle(): string {
    return fixture.debugElement.query(By.css('.mat-small')).nativeElement.textContent;
  }
});
