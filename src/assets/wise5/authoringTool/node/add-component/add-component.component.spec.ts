import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddComponentComponent } from './add-component.component';
import { CreateComponentService } from '../../../services/createComponentService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { provideRouter } from '@angular/router';
import { Node } from '../../../common/Node';

describe('AddComponentComponent', () => {
  let component: AddComponentComponent;
  let fixture: ComponentFixture<AddComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentComponent, StudentTeacherCommonServicesModule],
      providers: [
        CreateComponentService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        TeacherProjectService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentComponent);
    component = fixture.componentInstance;
    component.node = new Node();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
