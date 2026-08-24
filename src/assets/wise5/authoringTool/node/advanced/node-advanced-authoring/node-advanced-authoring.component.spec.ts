import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MockComponents, MockProvider } from 'ng-mocks';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditNodeRubricComponent } from '../../editRubric/edit-node-rubric.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from '../path/node-advanced-path-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../general/node-advanced-general-authoring.component';

describe('NodeAdvancedAuthoringComponent', () => {
  let component: NodeAdvancedAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NodeAdvancedAuthoringComponent,
        MockComponents(
          EditNodeRubricComponent,
          NodeAdvancedConstraintAuthoringComponent,
          NodeAdvancedGeneralAuthoringComponent,
          NodeAdvancedJsonAuthoringComponent,
          NodeAdvancedPathAuthoringComponent
        )
      ],
      providers: [
        MockProvider(TeacherProjectService),
        { provide: MAT_DIALOG_DATA, useValue: 'node1' }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NodeAdvancedAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: 'node1',
      type: 'node',
      constraints: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
