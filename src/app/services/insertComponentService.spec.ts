import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InsertComponentService } from '../../assets/wise5/services/insertComponentService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Node } from '../../assets/wise5/common/Node';

class MockProjectService {
  getNode() {}
  getNodeById() {}
}
let service: InsertComponentService;
let projectService: TeacherProjectService;
let node;
describe('InsertComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InsertComponentService,
        { provide: TeacherProjectService, useClass: MockProjectService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(InsertComponentService);
    projectService = TestBed.inject(TeacherProjectService);
    node = new Node();
    node.id = 'n1';
    node.components = [{ id: 'c1' }, { id: 'c2' }];
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    spyOn(projectService, 'getNode').and.returnValue(node);
  });
  insertComponents();
});

function insertComponents() {
  describe('insertComponents', () => {
    it('should insert components at the beginning of the node', () => {
      service.insertComponents([{ id: 'c3' }, { id: 'c4' }], 'n1', null);
      expectComponentsMatchIds(node.components, ['c3', 'c4', 'c1', 'c2']);
    });
    it('should insert components after the specified component', () => {
      service.insertComponents([{ id: 'c3' }, { id: 'c4' }], 'n1', 'c1');
      expectComponentsMatchIds(node.components, ['c1', 'c3', 'c4', 'c2']);
    });
  });
}

function expectComponentsMatchIds(components: any[], ids: string[]) {
  expect(components.length).toEqual(ids.length);
  components.forEach((component, i) => {
    expect(component.id).toEqual(ids[i]);
  });
}
