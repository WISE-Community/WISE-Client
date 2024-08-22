import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { RemoveNodeIdFromTransitionsService } from '../../assets/wise5/services/removeNodeIdFromTransitionsService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { copy } from '../../assets/wise5/common/object/object';

let demoProjectJSON: any;
let projectService: TeacherProjectService;
let service: RemoveNodeIdFromTransitionsService;
describe('RemoveNodeIdFromTransitionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      providers: [
        RemoveNodeIdFromTransitionsService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    demoProjectJSON = copy(demoProjectJSON_import);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(RemoveNodeIdFromTransitionsService);
  });
  shouldRemoveTransitionsGoingOutOfGroupInChildNodesOfGroup();
});

function shouldRemoveTransitionsGoingOutOfGroupInChildNodesOfGroup() {
  it('should remove transitions going out of group in child nodes of group', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getTransitionsByFromNodeId('node18').length).toEqual(1);
    expect(projectService.getTransitionsByFromNodeId('node19').length).toEqual(1);
    service.removeTransitionsOutOfGroup('group1');
    expect(projectService.getTransitionsByFromNodeId('node18').length).toEqual(1);
    expect(projectService.getTransitionsByFromNodeId('node19').length).toEqual(0);
  });
}
