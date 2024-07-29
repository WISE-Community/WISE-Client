import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBranchComponent } from './edit-branch.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Branch } from '../../../../app/domain/branch';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteBranchService } from '../../services/deleteBranchService';

let teacherProjectService: TeacherProjectService;

describe('EditBranchComponent', () => {
  let component: EditBranchComponent;
  let fixture: ComponentFixture<EditBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EditBranchComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [DeleteBranchService, provideRouter([]), TeacherProjectService]
    }).compileComponents();
    window.history.pushState({ targetId: 'node1' }, '', '');
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getBranchesByBranchStartPointNodeId').and.returnValue([
      new Branch('node1', [['node2'], ['node3'], ['node4']], 'node5')
    ]);
    spyOn(teacherProjectService, 'getNodeById').and.returnValue({
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
