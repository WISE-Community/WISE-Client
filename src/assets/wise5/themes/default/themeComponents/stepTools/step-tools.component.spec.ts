import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StepSelectComponent } from '../stepSelect/step-select.component';
import { StepToolsComponent } from './step-tools.component';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentService } from '../../../../../../app/student/student.service';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { VLEProjectService } from '../../../../vle/vleProjectService';
import { of } from 'rxjs';
import { RunInfo } from '../../../../../../app/student/run-info';

const nodeId1 = 'node1';
let getCurrentNodeIdSpy: jasmine.Spy;

describe('StepToolsComponent', () => {
  let component: StepToolsComponent;
  let fixture: ComponentFixture<StepToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StepToolsComponent,
        StudentTeacherCommonServicesModule,
        MockComponent(StepSelectComponent)
      ],
      providers: [MockProvider(StudentService), provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepToolsComponent);
    getCurrentNodeIdSpy = spyOn(TestBed.inject(StudentDataService), 'getCurrentNodeId');
    getCurrentNodeIdSpy.and.returnValue(nodeId1);
    const projectService = TestBed.inject(VLEProjectService);
    spyOn(projectService, 'nodeHasWork').and.returnValue(true);
    spyOn(projectService, 'getNodesByToNodeId').and.returnValue([]);
    spyOn(TestBed.inject(StudentDataService), 'getRunStatus').and.returnValue({
      runId: '1',
      periods: []
    });
    spyOn(TestBed.inject(StudentService), 'getRunInfoById').and.returnValue(
      of({ isSurvey: false } as RunInfo)
    );
    component = fixture.componentInstance;
    component.notebookConfig = {
      itemTypes: {
        note: {
          enabled: true,
          label: {
            link: 'note'
          }
        }
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
