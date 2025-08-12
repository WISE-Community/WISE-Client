import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { Branch } from '../../../../app/domain/branch';
import { DeleteBranchService } from '../../services/deleteBranchService';
import { EditBranchService } from '../../services/editBranchService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { EditBranchComponent } from './edit-branch.component';

let projectService: TeacherProjectService;
describe('EditBranchComponent', () => {
  let component: EditBranchComponent;
  let fixture: ComponentFixture<EditBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBranchComponent],
      providers: [
        EditBranchService,
        DeleteBranchService,
        provideHttpClient(),
        provideRouter([]),
        MockProvider(TeacherProjectService, {
          idToOrder: {}
        })
      ]
    }).compileComponents();
    window.history.pushState({ targetId: 'node1' }, '', '');
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getBranchesByBranchStartPointNodeId').and.returnValue([
      new Branch('node1', [['node2'], ['node3'], ['node4']], 'node5')
    ]);
    spyOn(projectService, 'getNodeById').and.returnValue({
      title: 'node1',
      transitionLogic: {
        transitions: []
      }
    });
    fixture = TestBed.createComponent(EditBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
