import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestonesAuthoringComponent } from './milestones-authoring.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';

describe('MilestonesAuthoringComponent', () => {
  let component: MilestonesAuthoringComponent;
  let fixture: ComponentFixture<MilestonesAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestonesAuthoringComponent],
      providers: [MockProvider(TeacherProjectService), provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();

    TestBed.inject(TeacherProjectService).project = {};
    TestBed.inject(TeacherProjectService).idToOrder = {};
    fixture = TestBed.createComponent(MilestonesAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
