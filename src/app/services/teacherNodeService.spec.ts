import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { DataService } from './data.service';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { TeacherNodeService } from '../../assets/wise5/services/teacherNodeService';

let dataService: DataService;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
let projectService: ProjectService;
let service: TeacherNodeService;

describe('TeacherNodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      providers: [TeacherNodeService]
    });
    dataService = TestBed.inject(DataService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(TeacherNodeService);
  });
  getNextNodeId();
});

function getNextNodeId() {
  describe('getNextNodeId()', () => {
    describe('the next node id is a step node', () => {
      it('gets the next node id in the unit', async () => {
        spyOn(dataService, 'getCurrentNodeId').and.returnValue(nodeId1);
        spyOn(projectService, 'isApplicationNode').and.returnValue(true);
        projectService.idToOrder = {};
        projectService.idToOrder[nodeId1] = { order: 1 };
        projectService.idToOrder[nodeId2] = { order: 2 };
        expect(await service.getNextNodeId()).toEqual(nodeId2);
      });
    });
  });
}
