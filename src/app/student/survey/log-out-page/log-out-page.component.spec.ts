import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogOutPageComponent } from './log-out-page.component';

describe('LogOutPageComponent', () => {
  let component: LogOutPageComponent;
  let fixture: ComponentFixture<LogOutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogOutPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LogOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
