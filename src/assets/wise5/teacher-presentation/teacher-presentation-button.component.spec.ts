import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TeacherPresentationButtonComponent } from './teacher-presentation-button.component';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import { ConfigService } from '../services/configService';

describe('TeacherPresentationButtonComponent', () => {
  let component: TeacherPresentationButtonComponent;
  let fixture: ComponentFixture<TeacherPresentationButtonComponent>;
  let store: TeacherPresentationSelectionStore;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getPeriods', 'getRunId']);
    configServiceSpy.getPeriods.and.returnValue([
      { periodId: 10, periodName: 'Period 1' }
    ]);

    await TestBed.configureTestingModule({
      imports: [TeacherPresentationButtonComponent],
      providers: [
        TeacherPresentationSelectionStore,
        {
          provide: TeacherPresentationConfigService,
          useValue: jasmine.createSpyObj('TeacherPresentationConfigService', ['getConfig', 'saveConfig'])
        },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ConfigService, useValue: configServiceSpy }
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
    store.toggleParent(100);
    fixture.detectChanges();

    expect(component.isDisabled).toBeTrue();
    expect(component.tooltipText).toContain('Choose a specific period');
  });

  it('should be disabled when no posts or comments are selected', () => {
    component.periodId = 10;
    fixture.detectChanges();

    expect(component.isDisabled).toBeTrue();
    expect(component.tooltipText).toContain('Choose a post or comment first');
  });

  it('should be enabled when a single period is chosen and at least one item is selected', () => {
    component.periodId = 10;
    store.toggleParent(100);
    fixture.detectChanges();

    expect(component.isDisabled).toBeFalse();
    expect(component.tooltipText).toContain('Launch classroom presentation view');
  });

  it('should open TeacherPresentationDialogComponent when clicked and enabled', () => {
    component.periodId = 10;
    component.periodName = 'Period 1';
    store.toggleParent(100);
    fixture.detectChanges();

    component.openPresentationDialog();

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
    const dialogArgs = dialogSpy.open.calls.mostRecent().args;
    expect(dialogArgs[1]?.data).toEqual(jasmine.objectContaining({
      nodeId: 'node1',
      periodId: 10,
      periodName: 'Period 1',
      store: store
    }));
  });
});
