import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowMyWorkGradingComponent } from './show-my-work-grading.component';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ProjectService } from '../../../services/projectService';
import { MockComponent, MockProviders } from 'ng-mocks';
import { OpenResponseShowWorkComponent } from '../../openResponse/open-response-show-work/open-response-show-work.component';
import { NodeService } from '../../../services/nodeService';
import { AnnotationService } from '../../../services/annotationService';
import { UserService } from '../../../../../app/services/user.service';

let component: ShowMyWorkGradingComponent;
const componentId: string = 'component1';
let fixture: ComponentFixture<ShowMyWorkGradingComponent>;
const nodeId: string = 'node1';
let projectService: ProjectService;
let teacherDataService: TeacherDataService;
const workgroupId: number = 100;
describe('ShowMyWorkGradingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShowMyWorkGradingComponent, MockComponent(OpenResponseShowWorkComponent)],
      providers: [
        MockProviders(
          AnnotationService,
          NodeService,
          ProjectService,
          TeacherDataService,
          UserService
        )
      ]
    });
    projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getComponent').and.returnValue({
      id: componentId,
      type: 'OpenResponse'
    });
    teacherDataService = TestBed.inject(TeacherDataService);
    spyOn(
      teacherDataService,
      'getLatestComponentStateByWorkgroupIdNodeIdAndComponentId'
    ).and.returnValue({
      componentId: componentId,
      nodeId: nodeId,
      studentData: {
        attachments: []
      },
      workgroupId: workgroupId,
      componentType: 'OpenResponse'
    });
    fixture = TestBed.createComponent(ShowMyWorkGradingComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentId = componentId;
    component.workgroupId = workgroupId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
