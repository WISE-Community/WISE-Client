import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterTeacherCompleteComponent } from './register-teacher-complete.component';
import { ConfigService } from '../../services/config.service';
import { provideRouter } from '@angular/router';

export class MockConfigService {
  getContextPath(): string {
    return '/wise';
  }
}

describe('RegisterTeacherCompleteComponent', () => {
  let component: RegisterTeacherCompleteComponent;
  let fixture: ComponentFixture<RegisterTeacherCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterTeacherCompleteComponent],
      providers: [{ provide: ConfigService, useClass: MockConfigService }, provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTeacherCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
