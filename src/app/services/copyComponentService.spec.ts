import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { CopyComponentService } from '../../assets/wise5/services/copyComponentService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../assets/wise5/services/utilService';

class MockProjectService {
  getComponent() {}
  getUnusedComponentId() {}
}
class MockUtilService {
  makeCopyOfJSONObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

let service: CopyComponentService;
let projectService: TeacherProjectService;
let utilService: UtilService;
describe('CopyComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CopyComponentService,
        { provide: TeacherProjectService, useClass: MockProjectService },
        { provide: UtilService, useClass: MockUtilService }
      ]
    });
    service = TestBed.inject(CopyComponentService);
    projectService = TestBed.inject(TeacherProjectService);
    utilService = TestBed.inject(UtilService);
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
