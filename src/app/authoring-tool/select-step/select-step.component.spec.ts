import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectStepComponent } from './select-step.component';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SelectStepComponent', () => {
  let component: SelectStepComponent;
  let fixture: ComponentFixture<SelectStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule,
        SelectStepComponent,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(SelectStepComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1'
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
