import { TestBed } from '@angular/core/testing';
import { CreateComponentService } from '../../assets/wise5/services/createComponentService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentServiceLookupService } from '../../assets/wise5/services/componentServiceLookupService';
import { Node } from '../../assets/wise5/common/Node';

let componentServiceLookupService: ComponentServiceLookupService;
let projectService: TeacherProjectService;
let service: CreateComponentService;
let node;
describe('CreateComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      providers: [
        CreateComponentService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    node = new Node();
    componentServiceLookupService = TestBed.inject(ComponentServiceLookupService);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(CreateComponentService);
    spyOn(projectService, 'getNode').and.returnValue(node);
  });
  create_NullInsertAfterComponentId();
  create_NonNullInsertAfterComponentId();
});

function create_NullInsertAfterComponentId() {
  describe('create() without insertAfterComponentId', () => {
    it('should add the new component at the beginning', () => {
      const component1 = service.create('node1', 'HTML');
      expect(component1.type).toEqual('HTML');
      expectNodeComponentTypes(['HTML']);
      const component2 = service.create('node1', 'OpenResponse');
      expect(component2.type).toEqual('OpenResponse');
      expectNodeComponentTypes(['OpenResponse', 'HTML']);
    });
  });
}

function create_NonNullInsertAfterComponentId() {
  describe('create() with insertAfterComponentId', () => {
    it('should add the new component after the insertAfterComponentId', () => {
      const component1 = service.create('node1', 'HTML');
      expect(component1.type).toEqual('HTML');
      expectNodeComponentTypes(['HTML']);
      const component2 = service.create('node1', 'OpenResponse', component1.id);
      expect(component2.type).toEqual('OpenResponse');
      expectNodeComponentTypes(['HTML', 'OpenResponse']);
    });
  });
}

function expectNodeComponentTypes(types: string[]) {
  expect(node.components.map((c) => c.type)).toEqual(types);
}
