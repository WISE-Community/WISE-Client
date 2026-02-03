import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocationComponent } from './project-location.component';
import { ProjectService } from '../../services/projectService';
import { StudentProgress } from '../student-progress/StudentProgress';
import { ClassroomMonitorTestingModule } from '../classroom-monitor-testing.module';
import { Node } from '../../common/Node';

describe('ProjectLocationComponent', () => {
  let component: ProjectLocationComponent;
  let fixture: ComponentFixture<ProjectLocationComponent>;
  let projectService: ProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ProjectLocationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLocationComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
  });

  describe('ngOnChanges()', () => {
    describe('when project has multiple group nodes', () => {
      beforeEach(() => {
        spyOn(projectService, 'getOrderedGroupNodes').and.returnValue([
          { id: 'group1', title: 'Segment 1' },
          { id: 'group2', title: 'Segment 2' },
          { id: 'group3', title: 'Segment 3' }
        ]);
        spyOn(projectService, 'getParentGroup').and.returnValue({
          id: 'group2',
          title: 'Segment 2'
        });
      });

      it('should set segments to group nodes', () => {
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node2',
          nodePosition: '2.1',
          positionAndTitle: '2.1: Step Title'
        });
        component.ngOnChanges();
        expect(component['segments'].length).toBe(3);
        expect(component['segments'][0].id).toBe('group1');
      });

      it('should set current segment to parent group of current node', () => {
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node2',
          nodePosition: '2.1',
          positionAndTitle: '2.1: Step Title'
        });
        component.ngOnChanges();
        expect(component['currentSegment'].id).toBe('group2');
        expect(projectService.getParentGroup).toHaveBeenCalledWith('node2');
      });
    });

    describe('when project has single or no group nodes', () => {
      beforeEach(() => {
        spyOn(projectService, 'getOrderedGroupNodes').and.returnValue([
          { id: 'group1', title: 'Main Group' }
        ]);
        spyOn(projectService, 'getNode').and.returnValue({
          id: 'node2',
          title: 'Step 2',
          type: 'node'
        } as Node);
        projectService.idToOrder = {
          node1: { order: 1 },
          node2: { order: 2 },
          node3: { order: 3 },
          group1: { order: 0 }
        };
        spyOn(projectService, 'getNodes').and.returnValue([
          { id: 'group1', type: 'group' },
          { id: 'node1', type: 'node' },
          { id: 'node2', type: 'node' },
          { id: 'node3', type: 'node' }
        ]);
      });

      it('should set segments to ordered step nodes', () => {
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node2',
          nodePosition: '2',
          positionAndTitle: '2: Step Title'
        });
        component.ngOnChanges();
        expect(component['segments'].length).toBe(3);
        expect(component['segments'][0].id).toBe('node1');
        expect(component['segments'][1].id).toBe('node2');
        expect(component['segments'][2].id).toBe('node3');
      });

      it('should set current segment to current node', () => {
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node2',
          nodePosition: '2',
          positionAndTitle: '2: Step Title'
        });
        component.ngOnChanges();
        expect(component['currentSegment'].id).toBe('node2');
        expect(projectService.getNode).toHaveBeenCalledWith('node2');
      });

      it('should filter out group nodes from segments', () => {
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node1',
          nodePosition: '1',
          positionAndTitle: '1: First Step'
        });
        component.ngOnChanges();
        const hasGroupNode = component['segments'].some((segment) => segment.type === 'group');
        expect(hasGroupNode).toBeFalse();
      });

      it('should sort nodes by order', () => {
        projectService.idToOrder = {
          node1: { order: 3 },
          node2: { order: 1 },
          node3: { order: 2 },
          group1: { order: 0 }
        };
        component.studentProgress = new StudentProgress({
          currentNodeId: 'node2',
          nodePosition: '1',
          positionAndTitle: '1: Step Title'
        });
        component.ngOnChanges();
        expect(component['segments'][0].id).toBe('node2');
        expect(component['segments'][1].id).toBe('node3');
        expect(component['segments'][2].id).toBe('node1');
      });
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      spyOn(projectService, 'getOrderedGroupNodes').and.returnValue([
        { id: 'group1', title: 'Segment 1' },
        { id: 'group2', title: 'Segment 2' },
        { id: 'group3', title: 'Segment 3' }
      ]);
      spyOn(projectService, 'getParentGroup').and.returnValue({ id: 'group2', title: 'Segment 2' });
    });

    it('should display tooltip with position and title', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.studentProgress.positionAndTitle).toBe('2.1: Step Title');
    });

    it('should render all segments', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const segments = fixture.nativeElement.querySelectorAll('.segment');
      expect(segments.length).toBe(3);
    });

    it('should display node position and icon for current segment', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const segments = fixture.nativeElement.querySelectorAll('.segment');
      const activeSegment = segments[1]; // group2 is the second segment
      expect(activeSegment.textContent.trim()).toContain('2.1');
      expect(activeSegment.querySelector('mat-icon')).toBeTruthy();
      expect(activeSegment.querySelector('mat-icon').textContent).toBe('place');
    });

    it('should apply active class to current segment bar', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const segments = fixture.nativeElement.querySelectorAll('.segment');
      const activeSegmentBar = segments[1].querySelector('.segment-bar');
      expect(activeSegmentBar.classList.contains('active')).toBeTrue();
    });

    it('should not display node position or icon for non-current segments', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const segments = fixture.nativeElement.querySelectorAll('.segment');
      const inactiveSegment = segments[0]; // group1 is the first segment
      expect(inactiveSegment.querySelector('mat-icon')).toBeFalsy();
      expect(inactiveSegment.textContent.trim()).not.toContain('2.1');
    });

    it('should not apply active class to non-current segment bars', () => {
      component.studentProgress = new StudentProgress({
        currentNodeId: 'node2',
        nodePosition: '2.1',
        positionAndTitle: '2.1: Step Title'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const segments = fixture.nativeElement.querySelectorAll('.segment');
      const inactiveSegmentBar = segments[0].querySelector('.segment-bar');
      expect(inactiveSegmentBar.classList.contains('active')).toBeFalse();
    });
  });
});
