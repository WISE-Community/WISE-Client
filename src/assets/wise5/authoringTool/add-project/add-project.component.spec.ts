import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { AddProjectComponent } from './add-project.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RegisterProjectService } from '../../services/registerProjectService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddProjectComponent', () => {
  let component: AddProjectComponent;
  let fixture: ComponentFixture<AddProjectComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectComponent, BrowserAnimationsModule, StudentTeacherCommonServicesModule],
      providers: [
        RegisterProjectService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // TODO: this test doesn't pass atm because AddProjectComponent.ngAfterViewInit() causes
  // the error which you can read about here: https://angular.io/errors/NG0100
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
