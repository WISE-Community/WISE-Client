import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('KiCycleUsingOERComponent', () => {
  let component: KiCycleUsingOerComponent;
  let fixture: ComponentFixture<KiCycleUsingOerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [KiCycleUsingOerComponent],
    imports: [MatDividerModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
