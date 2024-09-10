import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBranchComponent } from './edit-branch.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideRouter } from '@angular/router';
import { Branch } from '../../../../app/domain/branch';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteBranchService } from '../../services/deleteBranchService';
import { CreateBranchService } from '../../services/createBranchService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let projectService: TeacherProjectService;
describe('EditBranchComponent', () => {
  let component: EditBranchComponent;
  let fixture: ComponentFixture<EditBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, EditBranchComponent, StudentTeacherCommonServicesModule],
      providers: [
        CreateBranchService,
        DeleteBranchService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        TeacherProjectService
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
