import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentTypeButtonComponent } from './component-type-button.component';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ComponentTypeButtonComponent', () => {
  let component: ComponentTypeButtonComponent;
  let fixture: ComponentFixture<ComponentTypeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentTypeButtonComponent, StudentTeacherCommonServicesModule],
      providers: [
        ComponentInfoService,
        ComponentServiceLookupService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentTypeButtonComponent);
    component = fixture.componentInstance;
    component.componentType = 'OpenResponse';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
