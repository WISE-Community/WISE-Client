import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogOutPageComponent } from './log-out-page.component';
import { LogOutService } from '../../../services/logOutService';
import { MockProvider } from 'ng-mocks';

describe('LogOutPageComponent', () => {
  let component: LogOutPageComponent;
  let fixture: ComponentFixture<LogOutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogOutPageComponent],
      providers: [MockProvider(LogOutService)]
    }).compileComponents();

    fixture = TestBed.createComponent(LogOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
