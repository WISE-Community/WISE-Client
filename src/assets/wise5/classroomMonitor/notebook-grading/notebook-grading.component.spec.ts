import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../classroom-monitor-testing.module';
import { NotebookWorkgroupGradingComponent } from '../classroomMonitorComponents/notebook/notebook-workgroup-grading/notebook-workgroup-grading.component';
import { NotebookGradingComponent } from './notebook-grading.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: NotebookGradingComponent;
let fixture: ComponentFixture<NotebookGradingComponent>;
const WORKGROUP_ID_1 = 1;
const WORKGROUP_ID_2 = 2;
const WORKGROUP_1 = { notes: [], report: null, workgroupId: WORKGROUP_ID_1 };
const WORKGROUP_2 = { notes: [], report: null, workgroupId: WORKGROUP_ID_2 };

describe('NotebookGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotebookGradingComponent, NotebookWorkgroupGradingComponent],
      imports: [ClassroomMonitorTestingModule, MatListModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookGradingComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([
      WORKGROUP_1,
      WORKGROUP_2
    ]);
    spyOn(TestBed.inject(NotebookService), 'getStudentNotebookConfig').and.returnValue({
      itemTypes: {
        note: {
          enabled: true
        },
        report: {
          enabled: true,
          notes: [{ title: 'Final Report' }]
        }
      }
    });
    spyOn(TestBed.inject(TeacherDataService), 'isWorkgroupShown').and.returnValue(true);
    fixture.detectChanges();
  });

  expandAll();
  collapseAll();
  setSort();
});

function expandAll() {
  describe('expandAll()', () => {
    it('should expand all workgroups', () => {
      component.workVisibilityById[WORKGROUP_ID_1] = true;
      component.workVisibilityById[WORKGROUP_ID_2] = true;
      component.expandAll();
      expect(component.workVisibilityById[WORKGROUP_ID_1]).toBeTruthy();
      expect(component.workVisibilityById[WORKGROUP_ID_2]).toBeTruthy();
      expect(component.isExpandAll).toBeTruthy();
    });
  });
}

function collapseAll() {
  describe('collapseAll()', () => {
    it('should collapse all workgroups', () => {
      component.workVisibilityById[WORKGROUP_ID_1] = true;
      component.workVisibilityById[WORKGROUP_ID_2] = true;
      component.collapseAll();
      expect(component.workVisibilityById[WORKGROUP_ID_1]).toBeFalsy();
      expect(component.workVisibilityById[WORKGROUP_ID_2]).toBeFalsy();
      expect(component.isExpandAll).toBeFalsy();
    });
  });
}

function setSort() {
  describe('setSort()', () => {
    it('should set sort to team ascending', () => {
      component.sort = 'student';
      component.setSort('team');
      expect(component.sortedWorkgroups).toEqual([WORKGROUP_1, WORKGROUP_2]);
    });
    it('should set sort to team desscending', () => {
      component.sort = 'team';
      component.setSort('team');
      expect(component.sortedWorkgroups).toEqual([WORKGROUP_2, WORKGROUP_1]);
    });
  });
}
