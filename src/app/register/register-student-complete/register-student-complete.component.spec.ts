import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterStudentCompleteComponent } from './register-student-complete.component';
import { ConfigService } from '../../services/config.service';
import { provideRouter } from '@angular/router';

export class MockConfigService {
  getContextPath(): string {
    return '/wise';
  }
}

describe('RegisterStudentCompleteComponent', () => {
  let component: RegisterStudentCompleteComponent;
  let fixture: ComponentFixture<RegisterStudentCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterStudentCompleteComponent],
      providers: [{ provide: ConfigService, useClass: MockConfigService }, provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudentCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
