import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditComponentConstraintsComponent } from './edit-component-constraints.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';

describe('EditComponentConstraintsComponent', () => {
  let component: EditComponentConstraintsComponent;
  let fixture: ComponentFixture<EditComponentConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponentConstraintsComponent, StudentTeacherCommonServicesModule],
      providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentConstraintsComponent);
    component = fixture.componentInstance;
    component.componentContent = {} as ComponentContent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
