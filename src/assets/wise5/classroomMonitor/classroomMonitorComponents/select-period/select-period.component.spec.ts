import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SelectPeriodComponent } from './select-period.component';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { of } from 'rxjs';
describe('SelectPeriodComponent', () => {
  let component: SelectPeriodComponent;
  let fixture: ComponentFixture<SelectPeriodComponent>;
  let loader: HarnessLoader;
  let configService: jasmine.SpyObj<ConfigService>;
  let dataService: jasmine.SpyObj<TeacherDataService>;
  let workgroupService: jasmine.SpyObj<WorkgroupService>;
  let workgroupsInPeriod: Map<number, number>;

  const mockPeriods = [
    { periodId: -1, periodName: 'All Periods' },
    { periodId: 1, periodName: 'Period 1' },
    { periodId: 2, periodName: 'Period 2' }
  ];

  beforeEach(async () => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'configRetrieved$',
      'isClassroomMonitor'
    ]);
    const dataServiceSpy = jasmine.createSpyObj('TeacherDataService', [
      'getCurrentPeriod',
      'getPeriods',
      'currentPeriodChanged$',
      'setCurrentPeriod'
    ]);
    const workgroupServiceSpy = jasmine.createSpyObj('WorkgroupService', ['getWorkgroupsInPeriod']);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SelectPeriodComponent],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: TeacherDataService, useValue: dataServiceSpy },
        { provide: WorkgroupService, useValue: workgroupServiceSpy }
      ]
    }).compileComponents();

    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    dataService = TestBed.inject(TeacherDataService) as jasmine.SpyObj<TeacherDataService>;
    workgroupService = TestBed.inject(WorkgroupService) as jasmine.SpyObj<WorkgroupService>;

    configService.isClassroomMonitor.and.returnValue(true);
    configService.configRetrieved$ = of({});
    dataService.getCurrentPeriod.and.returnValue({ periodId: 1, periodName: 'Period 1' });
    dataService.getPeriods.and.returnValue(mockPeriods);
    dataService.currentPeriodChanged$ = of({
      currentPeriod: { periodId: 1, periodName: 'Period 1' }
    });
    workgroupsInPeriod = new Map<number, number>();
    workgroupsInPeriod.set(1, 1);
    workgroupsInPeriod.set(2, 2);
    workgroupsInPeriod.set(3, 3);
    workgroupService.getWorkgroupsInPeriod.and.returnValue(workgroupsInPeriod);

    fixture = TestBed.createComponent(SelectPeriodComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct period data', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('Period: Period 1');
  });

  it('should update period when selection changes', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    await options[2].click(); // Select Period 2
    expect(dataService.setCurrentPeriod).toHaveBeenCalledWith(mockPeriods[2]);
  });

  it('should hide All Periods option when only one period exists', () => {
    dataService.getPeriods.and.returnValue([
      { periodId: -1, periodName: 'All Periods' },
      { periodId: 1, periodName: 'Period 1' }
    ]);
    component.ngOnInit();
    expect(component['periods'].length).toBe(1);
    expect(component['periods'][0].periodId).toBe(1);
  });

  it('should calculate correct number of workgroups per period', () => {
    component.ngOnInit();
    expect(component['periods'][1].numWorkgroupsInPeriod).toBe(3);
    expect(component['periods'][0].numWorkgroupsInPeriod).toBe(6); // Total for all periods
  });
});
