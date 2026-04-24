import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';
import { MockProvider } from 'ng-mocks';

let component: NodeAdvancedConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeAdvancedConstraintAuthoringComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedConstraintAuthoringComponent);
    component = fixture.componentInstance;
    component['node'] = {
      id: 'node1',
      constraints: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
