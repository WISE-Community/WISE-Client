import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterGoogleUserAlreadyExistsComponent } from './register-google-user-already-exists.component';
import { ConfigService } from '../../services/config.service';
import { provideHttpClient } from '@angular/common/http';

describe('RegisterGoogleUserAlreadyExistsComponent', () => {
  let component: RegisterGoogleUserAlreadyExistsComponent;
  let fixture: ComponentFixture<RegisterGoogleUserAlreadyExistsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterGoogleUserAlreadyExistsComponent],
      providers: [ConfigService, provideHttpClient()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterGoogleUserAlreadyExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
