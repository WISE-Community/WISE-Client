import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { SpaceService } from '../../assets/wise5/services/spaceService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
let service: SpaceService;
let teacherProjectService: TeacherProjectService;

describe('SpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        ConfigService,
        CopyNodesService,
        TeacherProjectService,
        SessionService,
        SpaceService,
        UtilService
      ]
    });
    teacherProjectService = TestBed.get(TeacherProjectService);
    service = TestBed.get(SpaceService);
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
