import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponentMaxSubmitComponent } from './edit-component-max-submit.component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';

describe('EditComponentMaxSubmitComponent', () => {
  let component: EditComponentMaxSubmitComponent;
  let fixture: ComponentFixture<EditComponentMaxSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponentMaxSubmitComponent],
      providers: [MockProvider(TeacherProjectService), provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentMaxSubmitComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
