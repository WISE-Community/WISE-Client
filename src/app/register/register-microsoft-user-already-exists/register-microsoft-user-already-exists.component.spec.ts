import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterMicrosoftUserAlreadyExistsComponent } from './register-microsoft-user-already-exists.component';

describe('RegisterMicrosoftUserAlreadyExistsComponent', () => {
  let component: RegisterMicrosoftUserAlreadyExistsComponent;
  let fixture: ComponentFixture<RegisterMicrosoftUserAlreadyExistsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterMicrosoftUserAlreadyExistsComponent]
    });
    fixture = TestBed.createComponent(RegisterMicrosoftUserAlreadyExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
