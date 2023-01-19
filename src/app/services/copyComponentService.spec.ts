import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { CopyComponentService } from '../../assets/wise5/services/copyComponentService';
import { ObjectService } from '../../assets/wise5/services/objectService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';

class MockProjectService {
  getComponent() {}
  getUnusedComponentId() {}
}

let service: CopyComponentService;
let projectService: TeacherProjectService;
describe('CopyComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CopyComponentService,
        ObjectService,
        { provide: TeacherProjectService, useClass: MockProjectService }
      ]
    });
    service = TestBed.inject(CopyComponentService);
    projectService = TestBed.inject(TeacherProjectService);
  });
  copyComponents();
});

function copyComponents() {
  describe('copyComponents', () => {
    it('should return a copy of the specified components with new ids', () => {
      spyOn(projectService, 'getComponent').and.returnValues(
        { id: 'c1' } as ComponentContent,
        { id: 'c2' } as ComponentContent
      );
      spyOn(projectService, 'getUnusedComponentId').and.returnValues('c3', 'c4');
      const copies = service.copyComponents('node1', ['c1', 'c2']);
      expect(copies.length).toEqual(2);
      expect(copies[0].id).toEqual('c3');
      expect(copies[1].id).toEqual('c4');
    });
  });
}
