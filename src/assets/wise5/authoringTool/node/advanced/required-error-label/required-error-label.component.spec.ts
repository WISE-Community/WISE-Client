import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequiredErrorLabelComponent } from './required-error-label.component';

describe('RequiredErrorLabelComponent', () => {
  let component: RequiredErrorLabelComponent;
  let fixture: ComponentFixture<RequiredErrorLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredErrorLabelComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredErrorLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
