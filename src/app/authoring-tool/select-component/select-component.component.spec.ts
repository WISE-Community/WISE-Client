import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponentComponent } from './select-component.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { SelectStepComponent } from '../select-step/select-step.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SelectComponentComponent', () => {
  let component: SelectComponentComponent;
  let fixture: ComponentFixture<SelectComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule,
        SelectStepComponent,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(SelectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
