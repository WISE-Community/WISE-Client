import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SelfDirectedInvestigationComponent2', () => {
  let component: SelfDirectedInvestigationComponent;
  let fixture: ComponentFixture<SelfDirectedInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SelfDirectedInvestigationComponent],
    imports: [MatDividerModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(SelfDirectedInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
