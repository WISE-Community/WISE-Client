import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { AchievementService } from '../../../../services/achievementService';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { PeerGroupService } from '../../../../services/peerGroupService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentStatusService } from '../../../../services/studentStatusService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { SelectPeriodComponent } from '../../select-period/select-period.component';
import { PeerGroupAssignedWorkgroupsComponent } from '../peer-group-assigned-workgroups/peer-group-assigned-workgroups.component';
import { PeerGroupUnassignedWorkgroupsComponent } from '../peer-group-unassigned-workgroups/peer-group-unassigned-workgroups.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PeerGroupPeriodComponent } from './peer-group-period.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PeerGroupGroupingComponent } from '../peer-group-grouping/peer-group-grouping.component';
import { PeerGroupWorkgroupComponent } from '../peer-group-workgroup/peer-group-workgroup.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PeerGroupPeriodComponent', () => {
  let component: PeerGroupPeriodComponent;
  let fixture: ComponentFixture<PeerGroupPeriodComponent>;
  let grouping1: any;
  let grouping2: any;
  let workgroup1: any;
  let workgroup2: any;
  let workgroup3: any;
  let workgroup4: any;
  let workgroup5: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        PeerGroupAssignedWorkgroupsComponent,
        PeerGroupPeriodComponent,
        PeerGroupGroupingComponent,
        PeerGroupUnassignedWorkgroupsComponent,
        PeerGroupWorkgroupComponent,
        SelectPeriodComponent
    ],
    imports: [BrowserAnimationsModule,
        CommonModule,
        DragDropModule,
        FlexLayoutModule,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule],
    providers: [
        AchievementService,
        AnnotationService,
        ConfigService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        NotificationService,
        PeerGroupService,
        ProjectService,
        SessionService,
        StudentDataService,
        StudentStatusService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        WorkgroupService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupPeriodComponent);
    spyOn(TestBed.inject(PeerGroupService), 'moveWorkgroupToGroup').and.callFake(() => {
      return of({});
    });
    spyOn(TestBed.inject(PeerGroupService), 'removeWorkgroupFromGroup').and.callFake(() => {
      return of({});
    });
    spyOn(TestBed.inject(ConfigService), 'getDisplayUsernamesByWorkgroupId').and.callFake(() => {
      return 'Student Name Here';
    });
    component = fixture.componentInstance;
    component.period = { periodId: 1, periodName: '1' };
    workgroup1 = createWorkgroup(1);
    workgroup2 = createWorkgroup(2);
    workgroup3 = createWorkgroup(3);
    workgroup4 = createWorkgroup(4);
    workgroup5 = createWorkgroup(5);
    component.workgroups = [workgroup1, workgroup2, workgroup3, workgroup4, workgroup5];
    component.unassignedWorkgroups = [workgroup5];
    grouping1 = createGrouping(1, [workgroup1, workgroup2]);
    grouping2 = createGrouping(2, [workgroup3, workgroup4]);
    component.groupings = [grouping1, grouping2];
    component.nextAvailableGroupId = 3;
    fixture.detectChanges();
  });

  function createWorkgroup(id: number): any {
    return {
      username: '',
      id: id
    };
  }

  function createGrouping(id: number, members: any[]): any {
    return {
      id: id,
      members: members
    };
  }

  function createEvent(
    workgroupId: number,
    previousContainerId: number,
    newContainerId: number
  ): any {
    return {
      container: {
        data: {
          id: newContainerId
        }
      },
      item: {
        data: workgroupId
      },
      previousContainer: {
        data: {
          id: previousContainerId
        }
      }
    };
  }

  function moveWorkgroup() {
    describe('moveWorkgroup()', () => {
      it('should move a workgroup from unassigned to assigned', fakeAsync(() => {
        expectGroupingWorkgroupsLength(grouping1, 2);
        const event = createEvent(5, 0, 1);
        component.moveWorkgroup(event);
        expectGroupingWorkgroupsLength(grouping1, 3);
      }));

      it('should move a workgroup from assigned to unassigned', fakeAsync(() => {
        expectGroupingWorkgroupsLength(grouping1, 2);
        const event = createEvent(1, 1, 0);
        component.moveWorkgroup(event);
        expectGroupingWorkgroupsLength(grouping1, 1);
      }));

      it('should move a workgroup from assigned to assigned', fakeAsync(() => {
        expectGroupingWorkgroupsLength(grouping1, 2);
        expectGroupingWorkgroupsLength(grouping2, 2);
        const event = createEvent(1, 1, 2);
        component.moveWorkgroup(event);
        expectGroupingWorkgroupsLength(grouping1, 1);
        expectGroupingWorkgroupsLength(grouping2, 3);
      }));
    });
  }

  function expectGroupingWorkgroupsLength(grouping: any, expectedNumWorkgroups: number): void {
    expect(grouping.members.length).toEqual(expectedNumWorkgroups);
  }

  function createNewGroup() {
    describe('createNewGroup()', () => {
      it('should create a new group', () => {
        expect(component.groupings.length).toEqual(2);
        spyOn(TestBed.inject(PeerGroupService), 'createNewGroup').and.returnValue(of({ id: 5 }));
        component.createNewGroup();
        expect(component.groupings.length).toEqual(3);
      });
    });
  }

  createNewGroup();
  moveWorkgroup();
});
