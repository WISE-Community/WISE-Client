import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamsOnNodeComponent } from './teams-on-node.component';
import { ClassroomStatusService } from '../../../assets/wise5/services/classroomStatusService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { Subject } from 'rxjs';

describe('TeamsOnNodeComponent', () => {
  let component: TeamsOnNodeComponent;
  let fixture: ComponentFixture<TeamsOnNodeComponent>;
  let classroomStatusService: jasmine.SpyObj<ClassroomStatusService>;
  let configService: jasmine.SpyObj<ConfigService>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let studentStatusReceivedSubject: Subject<void>;

  const nodeId = 'node1';
  const stepNodeId = 'node2';
  const lessonNodeId = 'group1';
  const periodId = 1;
  const periodName = 'Period 1';

  const createMockWorkgroup = (workgroupId: number) => ({
    workgroupId,
    periodId
  });

  beforeEach(async () => {
    studentStatusReceivedSubject = new Subject<void>();
    const classroomStatusServiceSpy = jasmine.createSpyObj('ClassroomStatusService', [
      'getWorkgroupsOnNode'
    ]);
    classroomStatusServiceSpy.studentStatusReceived$ = studentStatusReceivedSubject.asObservable();
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'getPermissions',
      'getDisplayUsernamesByWorkgroupId'
    ]);
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['isApplicationNode']);

    await TestBed.configureTestingModule({
      imports: [TeamsOnNodeComponent],
      providers: [
        { provide: ClassroomStatusService, useValue: classroomStatusServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: ProjectService, useValue: projectServiceSpy }
      ]
    }).compileComponents();

    classroomStatusService = TestBed.inject(
      ClassroomStatusService
    ) as jasmine.SpyObj<ClassroomStatusService>;
    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;

    fixture = TestBed.createComponent(TeamsOnNodeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to studentStatusReceived$ and call ngOnChanges', () => {
      component.nodeId = nodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue([]);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      fixture.detectChanges();

      spyOn(component, 'ngOnChanges');
      studentStatusReceivedSubject.next();

      expect(component.ngOnChanges).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.nodeId = nodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue([]);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      fixture.detectChanges();

      spyOn(component['subscriptions'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    describe('workgroups on node', () => {
      it('should get workgroups on node for the specified period', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
        component.nodeId = nodeId;
        component.period = { periodId, periodName };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
        projectService.isApplicationNode.and.returnValue(true);
        configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

        component.ngOnChanges();

        expect(classroomStatusService.getWorkgroupsOnNode).toHaveBeenCalledWith(nodeId, periodId);
        expect(component['workgroupsOnNode']).toEqual(workgroups);
      });
    });

    describe('tooltip text for step', () => {
      beforeEach(() => {
        component.nodeId = stepNodeId;
        projectService.isApplicationNode.and.returnValue(true);
        configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);
      });

      it('should create tooltip text for single team on step in specific period', () => {
        const workgroups = [createMockWorkgroup(1)];
        component.period = { periodId, periodName };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('1 team on this step (Period: Period 1)');
      });

      it('should create tooltip text for multiple teams on step in specific period', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2), createMockWorkgroup(3)];
        component.period = { periodId, periodName };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('3 teams on this step (Period: Period 1)');
      });

      it('should create tooltip text for single team on step in all periods', () => {
        const workgroups = [createMockWorkgroup(1)];
        component.period = { periodId: -1, periodName: 'All Periods' };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('1 team on this step (All periods)');
      });

      it('should create tooltip text for multiple teams on step in all periods', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
        component.period = { periodId: -1, periodName: 'All Periods' };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('2 teams on this step (All periods)');
      });
    });

    describe('tooltip text for lesson', () => {
      beforeEach(() => {
        component.nodeId = lessonNodeId;
        projectService.isApplicationNode.and.returnValue(false);
        configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);
      });

      it('should create tooltip text for single team on lesson in specific period', () => {
        const workgroups = [createMockWorkgroup(1)];
        component.period = { periodId, periodName };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('1 team on this lesson (Period: Period 1)');
      });

      it('should create tooltip text for multiple teams on lesson in specific period', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
        component.period = { periodId, periodName };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('2 teams on this lesson (Period: Period 1)');
      });

      it('should create tooltip text for single team on lesson in all periods', () => {
        const workgroups = [createMockWorkgroup(1)];
        component.period = { periodId: -1, periodName: 'All Periods' };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('1 team on this lesson (All periods)');
      });

      it('should create tooltip text for multiple teams on lesson in all periods', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2), createMockWorkgroup(3)];
        component.period = { periodId: -1, periodName: 'All Periods' };
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('3 teams on this lesson (All periods)');
      });
    });

    describe('tooltip text with student names', () => {
      beforeEach(() => {
        component.nodeId = stepNodeId;
        component.period = { periodId, periodName };
        projectService.isApplicationNode.and.returnValue(true);
        configService.getPermissions.and.returnValue({ canViewStudentNames: true } as any);
      });

      it('should append student names to tooltip when permission is granted', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
        configService.getDisplayUsernamesByWorkgroupId.and.callFake((workgroupId: number) => {
          if (workgroupId === 1) return 'Alice, Bob';
          if (workgroupId === 2) return 'Charlie, David';
          return '';
        });

        component.ngOnChanges();

        expect(component['tooltipText']).toBe(
          '2 teams on this step (Period: Period 1)\nAlice, Bob\nCharlie, David\n'
        );
      });

      it('should not append student names when permission is not granted', () => {
        const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
        classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
        configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

        component.ngOnChanges();

        expect(component['tooltipText']).toBe('2 teams on this step (Period: Period 1)');
        expect(configService.getDisplayUsernamesByWorkgroupId).not.toHaveBeenCalled();
      });
    });
  });

  describe('template rendering', () => {
    it('should display workgroup count when there are workgroups on node', () => {
      const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2), createMockWorkgroup(3)];
      component.nodeId = nodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      component.ngOnChanges();
      fixture.detectChanges();

      const countElement = fixture.nativeElement.querySelector('.progress-wrapper');
      expect(countElement).toBeTruthy();
      expect(countElement.textContent.trim()).toContain('3');
    });

    it('should not display anything when there are no workgroups on node', () => {
      component.nodeId = nodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue([]);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      component.ngOnChanges();
      fixture.detectChanges();

      const countElement = fixture.nativeElement.querySelector('.progress-wrapper');
      expect(countElement).toBeFalsy();
    });

    it('should display mat-icon with person icon', () => {
      const workgroups = [createMockWorkgroup(1)];
      component.nodeId = nodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      component.ngOnChanges();
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('mat-icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement.textContent.trim()).toBe('person');
    });

    it('should set tooltip text for mat-icon', () => {
      const workgroups = [createMockWorkgroup(1), createMockWorkgroup(2)];
      component.nodeId = stepNodeId;
      component.period = { periodId, periodName };
      classroomStatusService.getWorkgroupsOnNode.and.returnValue(workgroups);
      projectService.isApplicationNode.and.returnValue(true);
      configService.getPermissions.and.returnValue({ canViewStudentNames: false } as any);

      component.ngOnChanges();
      fixture.detectChanges();

      expect(component['tooltipText']).toBe('2 teams on this step (Period: Period 1)');
    });
  });
});
