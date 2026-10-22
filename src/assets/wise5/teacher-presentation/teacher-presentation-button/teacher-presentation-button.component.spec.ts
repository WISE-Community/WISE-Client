import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TeacherPresentationButtonComponent } from './teacher-presentation-button.component';
import { TeacherPresentationSelectionStore } from '../state/teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from '../services/teacher-presentation-config.service';
import { ConfigService } from '../../services/configService';
import { TeacherDataService } from '../../services/teacherDataService';

describe('TeacherPresentationButtonComponent', () => {
  let component: TeacherPresentationButtonComponent;
  let fixture: ComponentFixture<TeacherPresentationButtonComponent>;
  let store: TeacherPresentationSelectionStore;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let teacherDataServiceSpy: jasmine.SpyObj<TeacherDataService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getPeriods', 'getRunId']);
    configServiceSpy.getPeriods.and.returnValue([{ periodId: 10, periodName: 'Period 1' }]);
    teacherDataServiceSpy = jasmine.createSpyObj('TeacherDataService', ['saveEvent']);
    teacherDataServiceSpy.saveEvent.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      imports: [TeacherPresentationButtonComponent],
      providers: [
        TeacherPresentationSelectionStore,
        {
          provide: TeacherPresentationConfigService,
          useValue: jasmine.createSpyObj('TeacherPresentationConfigService', [
            'getConfig',
            'saveConfig'
          ])
        },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: TeacherDataService, useValue: teacherDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherPresentationButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(TeacherPresentationSelectionStore);
    component.store = store;
    component.node = { id: 'node1' } as any;
    component.component = { id: 'comp1', type: 'Discussion' } as any;
  });

  it('should be disabled when period is all periods (-1 or null)', () => {
    component.periodId = -1;
    store.select(100);
    fixture.detectChanges();

    expect(component.isDisabled).toBeTrue();
    expect(component.tooltipText).toContain('Choose a specific period to present');
  });

  it('should be disabled when no posts or comments are selected', () => {
    component.periodId = 10;
    fixture.detectChanges();

    expect(component.isDisabled).toBeTrue();
    expect(component.tooltipText).toContain('Select some posts or comments to present');
  });

  it('should be enabled when a single period is chosen and at least one item is selected', () => {
    component.periodId = 10;
    store.select(100);
    fixture.detectChanges();

    expect(component.isDisabled).toBeFalse();
    expect(component.tooltipText).toContain('Launch presentation view');
  });

  it('should open TeacherPresentationDialogComponent and log open and close events when clicked and enabled', () => {
    component.periodId = 10;
    component.periodName = 'Period 1';
    store.select(100);
    fixture.detectChanges();

    component.openPresentationDialog();

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
    const dialogArgs = dialogSpy.open.calls.mostRecent().args;
    expect(dialogArgs[1]?.data).toEqual(
      jasmine.objectContaining({
        nodeId: 'node1',
        periodId: 10,
        periodName: 'Period 1',
        store: store
      })
    );

    expect(teacherDataServiceSpy.saveEvent).toHaveBeenCalledWith(
      'ClassroomMonitor',
      'node1',
      'comp1',
      'Discussion',
      'TeacherPresentation',
      'TeacherPresentationOpened',
      {
        periodId: 10,
        totalResponsesSelected: 1
      }
    );

    expect(teacherDataServiceSpy.saveEvent).toHaveBeenCalledWith(
      'ClassroomMonitor',
      'node1',
      'comp1',
      'Discussion',
      'TeacherPresentation',
      'TeacherPresentationClosed',
      jasmine.objectContaining({
        periodId: 10,
        durationMs: jasmine.any(Number)
      })
    );
  });

  it('should log correct counts when presenting Ideas', () => {
    component.periodId = 10;
    component.component = { id: 'comp1', type: 'OpenResponse' } as any;
    store.init(1, 10, 'node1', 'comp1', 'OpenResponse', 'Ideas');
    store.toggleIdea('idea1');
    fixture.detectChanges();

    component.openPresentationDialog();

    expect(teacherDataServiceSpy.saveEvent).toHaveBeenCalledWith(
      'ClassroomMonitor',
      'node1',
      'comp1',
      'OpenResponse',
      'TeacherPresentation',
      'TeacherPresentationOpened',
      {
        periodId: 10,
        totalIdeasSelected: 1,
        totalResponsesSelected: 0
      }
    );
  });
});
