import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

import { DataService } from './data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: DataService;
let projectService: ProjectService;

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(DataService);
    projectService = TestBed.inject(ProjectService);
  });

  setCurrentNode();
});

function setCurrentNode() {
  it('should set the new current node when there is no current node', () => {
    const node = { id: 'node1' };
    expect(service.currentNode).toEqual(null);
    service.setCurrentNode(node);
    expect(service.currentNode).toEqual(node);
  });
  it('should set the new current node when there is a current node', () => {
    const node1 = { id: 'node1' };
    const node2 = { id: 'node2' };
    service.setCurrentNode(node1);
    expect(service.currentNode).toEqual(node1);
    spyOn(projectService, 'isGroupNode').and.callFake(() => {
      return false;
    });
    spyOn(service, 'broadcastCurrentNodeChanged').and.callFake(() => {});
    service.setCurrentNode(node2);
    expect(service.previousStep).toEqual(node1);
    expect(service.currentNode).toEqual(node2);
  });
}
