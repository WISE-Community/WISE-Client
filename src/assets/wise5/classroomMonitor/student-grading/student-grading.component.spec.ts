import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../classroom-monitor-testing.module';
import { StudentGradingComponent } from './student-grading.component';

class MockUpgradeModule {
  $injector: any = {
    get() {
      return { go: () => {}, onSuccess: () => {} };
    }
  };
}

let component: StudentGradingComponent;
let fixture: ComponentFixture<StudentGradingComponent>;
const nodeIds = ['node1', 'node2'];

describe('StudentGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentGradingComponent],
      imports: [ClassroomMonitorTestingModule, MatListModule],
      providers: [
        {
          provide: UpgradeModule,
          useClass: MockUpgradeModule
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradingComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue(
      nodeIds
    );
    fixture.detectChanges();
    for (const nodeId of component.nodeIds) {
      component.nodesInViewById[nodeId] = true;
    }
  });

  expandAll();
  collapseAll();
});

function setNodeVisibilityForAllNodes(component: StudentGradingComponent, value: boolean) {
  for (const nodeId of component.nodeIds) {
    component.nodeVisibilityById[nodeId] = value;
  }
}

function expandAll() {
  describe('expandAll', () => {
    it('should expand all nodes', () => {
      setNodeVisibilityForAllNodes(component, false);
      component.expandAll();
      for (const nodeId of component.nodeIds) {
        expect(component.nodeVisibilityById[nodeId]).toEqual(true);
      }
      expect(component.isExpandAll).toEqual(true);
    });
  });
}

function collapseAll() {
  describe('collapseAll', () => {
    it('should collapse all nodes', () => {
      setNodeVisibilityForAllNodes(component, true);
      component.collapseAll();
      for (const nodeId of component.nodeIds) {
        expect(component.nodeVisibilityById[nodeId]).toEqual(false);
      }
      expect(component.isExpandAll).toEqual(false);
    });
  });
}
