import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordAndConfirmComponent } from './new-password-and-confirm.component';

describe('NewPasswordAndConfirmComponent', () => {
  let component: NewPasswordAndConfirmComponent;
  let fixture: ComponentFixture<NewPasswordAndConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordAndConfirmComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordAndConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
