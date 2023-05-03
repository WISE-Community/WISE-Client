import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNodeRubricComponent } from './edit-node-rubric.component';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';

let component: EditNodeRubricComponent;
let fixture: ComponentFixture<EditNodeRubricComponent>;
const node1: any = { rubric: '' };
const nodeId1: string = 'node1';

describe('EditNodeRubricComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNodeRubricComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [
        ClassroomStatusService,
        ConfigService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeRubricComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue(node1);
    fixture.detectChanges();
  });

  rubricChanged();
});

function rubricChanged() {
  describe('rubricChanged()', () => {
    it('should update the rubric in the node', () => {
      expect(component.node.rubric).toEqual('');
      const newRubric = 'Hello World';
      component.rubric = newRubric;
      component.rubricChanged();
      expect(component.node.rubric).toEqual(newRubric);
    });
  });
}
