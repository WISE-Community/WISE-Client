import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { copy } from '../../assets/wise5/common/object/object';
import { InsertComponentService } from '../../assets/wise5/services/insertComponentService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';

class MockProjectService {
  getNodeById() {}
  getComponentPosition() {}
}
let service: InsertComponentService;
let projectService: TeacherProjectService;
const NODE1 = {
  id: 'n1',
  components: [{ id: 'c1' }, { id: 'c2' }]
};
let node;
describe('InsertComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InsertComponentService,
        { provide: TeacherProjectService, useClass: MockProjectService }
      ]
    });
    service = TestBed.inject(InsertComponentService);
    projectService = TestBed.inject(TeacherProjectService);
    node = copy(NODE1);
    spyOn(projectService, 'getNodeById').and.returnValue(node);
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
      spyOn(projectService, 'getComponentPosition').and.returnValue(0);
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
