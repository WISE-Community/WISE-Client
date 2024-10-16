import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('KiCycleUsingOERComponent', () => {
  let component: KiCycleUsingOerComponent;
  let fixture: ComponentFixture<KiCycleUsingOerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, KiCycleUsingOerComponent],
      providers: [
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(KiCycleUsingOerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
