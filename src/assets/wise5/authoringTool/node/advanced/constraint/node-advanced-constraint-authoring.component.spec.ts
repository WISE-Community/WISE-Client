// @ts-nocheck
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AchievementService } from '../../../../services/achievementService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { NodeAdvancedAuthoringComponent } from '../node-advanced-authoring/node-advanced-authoring.component';

let component: NodeAdvancedConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;
const nodeId1 = 'node1';

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      declarations: [NodeAdvancedAuthoringComponent, NodeAdvancedConstraintAuthoringComponent],
      providers: [
        AchievementService,
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(NodeAdvancedConstraintAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue(
      []
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: 'node1',
      constraints: []
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
