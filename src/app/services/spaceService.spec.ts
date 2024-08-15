import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SpaceService } from '../../assets/wise5/services/spaceService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
let service: SpaceService;
let teacherProjectService: TeacherProjectService;

describe('SpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [CopyNodesService, SpaceService, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    teacherProjectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(SpaceService);
  });
  createSpace();
  addSpace();
  removeSpace();
});

function createSpace() {
  describe('createSpace()', () => {
    it('should create a space object', () => {
      const id = 'public';
      const name = 'Public';
      const isPublic = true;
      const isShowInNotebook = true;
      const space = service.createSpace(id, name, isPublic, isShowInNotebook);
      expect(space).toEqual({
        id: id,
        name: name,
        isPublic: isPublic,
        isShowInNotebook: isShowInNotebook
      });
    });
  });
}

function addSpace() {
  describe('addSpace()', () => {
    it('should add a space', () => {
      const id = 'public';
      const name = 'Public';
      const isPublic = true;
      const isShowInNotebook = true;
      spyOn(teacherProjectService, 'addSpace');
      service.addSpace(id, name, isPublic, isShowInNotebook);
      expect(teacherProjectService.addSpace).toHaveBeenCalledWith({
        id: id,
        name: name,
        isPublic: isPublic,
        isShowInNotebook: isShowInNotebook
      });
    });
  });
}

function removeSpace() {
  describe('removeSpace()', () => {
    it('should remove a space', () => {
      spyOn(teacherProjectService, 'removeSpace');
      service.removeSpace('public');
      expect(teacherProjectService.removeSpace).toHaveBeenCalledWith('public');
    });
  });
}
