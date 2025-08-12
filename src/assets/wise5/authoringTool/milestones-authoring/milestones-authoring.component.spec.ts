import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MilestonesAuthoringComponent } from './milestones-authoring.component';

describe('MilestonesAuthoringComponent', () => {
  let component: MilestonesAuthoringComponent;
  let fixture: ComponentFixture<MilestonesAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestonesAuthoringComponent],
      providers: [MockProvider(TeacherProjectService)]
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
