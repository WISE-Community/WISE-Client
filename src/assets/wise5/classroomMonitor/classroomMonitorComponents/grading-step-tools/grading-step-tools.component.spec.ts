import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingStepToolsComponent } from './grading-step-tools.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent, MockProvider, MockProviders } from 'ng-mocks';
import { TeacherDataService } from '../../../services/teacherDataService';
import { GradingNodeService } from '../../../services/gradingNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { of } from 'rxjs';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { NodeService } from '../../../services/nodeService';

describe('GradingStepToolsComponent', () => {
  let component: GradingStepToolsComponent;
  let fixture: ComponentFixture<GradingStepToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingStepToolsComponent, MockComponent(NodeIconComponent)],
      providers: [
        MockProviders(NodeService, GradingNodeService),
        MockProvider(TeacherDataService, {
          currentNodeChanged$: of()
        }),
        MockProvider(TeacherProjectService, {
          idToOrder: {},
          projectParsed$: of()
        }),
        {
          provide: ActivatedRoute,
          useValue: { firstChild: { snapshot: { params: { nodeId: 'nodeId' } } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GradingStepToolsComponent);
    spyOn(TestBed.inject(Router), 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
