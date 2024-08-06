import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveIndicatorComponent } from './save-indicator.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SaveIndicatorComponent', () => {
  let component: SaveIndicatorComponent;
  let fixture: ComponentFixture<SaveIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule,
        SaveIndicatorComponent,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(SaveIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
