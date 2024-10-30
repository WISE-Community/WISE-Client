import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthoringToolBarComponent } from './authoring-tool-bar.component';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthoringToolBarComponent', () => {
  let component: AuthoringToolBarComponent;
  let fixture: ComponentFixture<AuthoringToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoringToolBarComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthoringToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
