import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CallToActionComponent } from './call-to-action.component';
import { provideRouter } from '@angular/router';

describe('CallToActionComponent', () => {
  let component: CallToActionComponent;
  let fixture: ComponentFixture<CallToActionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CallToActionComponent],
        providers: [provideRouter([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CallToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
