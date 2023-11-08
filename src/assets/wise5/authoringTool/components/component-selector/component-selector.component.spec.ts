import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentSelectorComponent } from './component-selector.component';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('ComponentSelectorComponent', () => {
  let component: ComponentSelectorComponent;
  let fixture: ComponentFixture<ComponentSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentSelectorComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [ComponentInfoService, ComponentServiceLookupService]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentSelectorComponent);
    component = fixture.componentInstance;
    component.componentType = 'OpenResponse';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
