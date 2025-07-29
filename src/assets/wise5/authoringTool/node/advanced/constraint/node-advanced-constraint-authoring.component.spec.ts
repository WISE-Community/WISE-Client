import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

let component: NodeAdvancedConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeAdvancedConstraintAuthoringComponent],
      providers: [
        MockProvider(TeacherProjectService),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { parent: { parent: { params: of({ nodeId: 'node1' }) } } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedConstraintAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: 'node1',
      constraints: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
