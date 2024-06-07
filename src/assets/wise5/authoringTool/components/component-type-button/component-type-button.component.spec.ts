import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentTypeButtonComponent } from './component-type-button.component';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ComponentTypeButtonComponent', () => {
  let component: ComponentTypeButtonComponent;
  let fixture: ComponentFixture<ComponentTypeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentTypeButtonComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [ComponentInfoService, ComponentServiceLookupService]
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
