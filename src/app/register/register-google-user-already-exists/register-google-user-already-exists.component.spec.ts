import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterGoogleUserAlreadyExistsComponent } from './register-google-user-already-exists.component';
import { ConfigService } from '../../services/config.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegisterGoogleUserAlreadyExistsComponent', () => {
  let component: RegisterGoogleUserAlreadyExistsComponent;
  let fixture: ComponentFixture<RegisterGoogleUserAlreadyExistsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [RegisterGoogleUserAlreadyExistsComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [ConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
