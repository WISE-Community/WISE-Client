import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('NodeAdvancedAuthoringComponent', () => {
  let component: NodeAdvancedAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeAdvancedAuthoringComponent],
      providers: [
        MockProvider(TeacherProjectService),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { parent: { params: of({ nodeId: 'node1' }) } }
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NodeAdvancedAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
