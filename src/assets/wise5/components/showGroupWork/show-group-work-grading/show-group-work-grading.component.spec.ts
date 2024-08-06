import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ShowGroupWorkGradingComponent } from './show-group-work-grading.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ShowGroupWorkGradingComponent', () => {
  let component: ShowGroupWorkGradingComponent;
  let fixture: ComponentFixture<ShowGroupWorkGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ShowGroupWorkGradingComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(ShowGroupWorkGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
