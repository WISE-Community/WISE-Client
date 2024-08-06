import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditComponentConstraintsComponent } from './edit-component-constraints.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditComponentConstraintsComponent', () => {
  let component: EditComponentConstraintsComponent;
  let fixture: ComponentFixture<EditComponentConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditComponentConstraintsComponent],
    imports: [MatFormFieldModule,
        MatIconModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(EditComponentConstraintsComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
