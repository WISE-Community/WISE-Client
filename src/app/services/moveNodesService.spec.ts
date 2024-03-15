import { TestBed } from '@angular/core/testing';
import { MoveNodesService } from '../../assets/wise5/services/moveNodesService';
import { copy } from '../../assets/wise5/common/object/object';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let demoProjectJSON: any;
const inactiveLessonId1 = 'group6';
const inactiveLessonId2 = 'group7';
let service: MoveNodesService;
let teacherProjectService: TeacherProjectService;

describe('MoveNodesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      providers: [MoveNodesService, TeacherProjectService]
    });
    service = TestBed.inject(MoveNodesService);
    demoProjectJSON = copy(demoProjectJSON_import);
    teacherProjectService = TestBed.inject(TeacherProjectService);
    teacherProjectService.setProject(demoProjectJSON);
  });
  moveInactiveLessonAfterInactiveLesson();
});

function moveInactiveLessonAfterInactiveLesson() {
  describe('move an inactive lesson after another inactive lesson', () => {
    it('moves inactive lesson', () => {
      let inactiveNodeIds = teacherProjectService.getInactiveNodeIds();
      expect(inactiveNodeIds.indexOf(inactiveLessonId1)).toBeLessThan(
        inactiveNodeIds.indexOf(inactiveLessonId2)
      );
      service.moveNodesAfter([inactiveLessonId1], inactiveLessonId2);
      inactiveNodeIds = teacherProjectService.getInactiveNodeIds();
      expect(inactiveNodeIds.indexOf(inactiveLessonId1)).toBeGreaterThan(
        inactiveNodeIds.indexOf(inactiveLessonId2)
      );
    });
    it('number of inactive nodes does not change', () => {
      const numInactiveNodes = teacherProjectService.getInactiveNodes().length;
      service.moveNodesAfter([inactiveLessonId1], inactiveLessonId2);
      expect(teacherProjectService.getInactiveNodes().length).toEqual(numInactiveNodes);
    });
  });
}
