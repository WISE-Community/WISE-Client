import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunSettingsDialogComponent } from './run-settings-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherService } from '../teacher.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { TeacherRun } from '../teacher-run';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';

export class MockTeacherService {
  addPeriodToRun(runId, periodName) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
  deletePeriodFromRun(runId, periodName) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
  changeMaxStudentsPerTeam(runId, maxStudentsPerTeam) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
  updateStartTime(runId, maxStudentsPerTeam) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
  updateEndTime(runId, maxStudentsPerTeam) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
  updateIsLockedAfterEndDate(runId, isLockedAfterEndDate) {
    return Observable.create((observer) => {
      const response: any = {};
      observer.next(response);
      observer.complete();
    });
  }
}

let component: RunSettingsDialogComponent;
let fixture: ComponentFixture<RunSettingsDialogComponent>;
let loader: HarnessLoader;
describe('RunSettingsDialogComponent', () => {
  function createNewRun() {
    return new TeacherRun({
      id: 1,
      name: 'Test Project',
      periods: ['1', '2', '3'],
      maxStudentsPerTeam: 1,
      startTime: new Date('2018-10-17T00:00:00.0').getTime(),
      endTime: new Date('2018-10-19T23:59:00.0').getTime()
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RunSettingsDialogComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: createNewRun() },
        { provide: TeacherService, useClass: MockTeacherService }
      ]
    });
    fixture = TestBed.createComponent(RunSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the periods', () => {
    const periodContainers = fixture.debugElement.nativeElement.querySelectorAll('.info-block');
    expect(periodContainers.length).toBe(3);
  });

  it('should populate the correct number of students per team', async () => {
    const singleMembershipOption = (await loader.getAllHarnesses(MatRadioButtonHarness))[0];
    expect(await singleMembershipOption.isChecked()).toBeTrue();
  });

  it('should populate the correct start date', () => {
    const startDate = component['startDate'];
    expect(startDate.getDate()).toBe(17);
    expect(startDate.getMonth()).toBe(9); // Months are 0-indexed
    expect(startDate.getUTCFullYear()).toBe(2018);
  });

  it('should populate the correct end date', () => {
    const endDate = component['endDate'];
    expect(endDate.getDate()).toBe(19);
    expect(endDate.getMonth()).toBe(9); // Months are 0-indexed
    expect(endDate.getUTCFullYear()).toBe(2018);
  });

  it('should add a period', () => {
    component.run.periods.push('4');
    fixture.detectChanges();
    const periodContainers = fixture.debugElement.nativeElement.querySelectorAll('.info-block');
    expect(periodContainers.length).toBe(4);
  });

  it('should delete a period', () => {
    component.run.periods.splice(2, 1);
    fixture.detectChanges();
    const periodContainers = fixture.debugElement.nativeElement.querySelectorAll('.info-block');
    expect(periodContainers.length).toBe(2);
  });

  it('should change the students per team', async () => {
    component.maxStudentsPerTeam = '3';
    fixture.detectChanges();
    const multiMembershipOption = (await loader.getAllHarnesses(MatRadioButtonHarness))[1];
    expect(await multiMembershipOption.isChecked()).toBeTrue();
  });

  it('should update is locked after end date false', () => {
    component.isLockedAfterEndDate = false;
    const teacherService = TestBed.inject(TeacherService);
    spyOn(teacherService, 'updateIsLockedAfterEndDate').and.returnValue(of({}));
    component.updateIsLockedAfterEndDate();
    expect(teacherService.updateIsLockedAfterEndDate).toHaveBeenCalledWith(1, false);
  });

  it('should update is locked after end date true', () => {
    component.isLockedAfterEndDate = true;
    const teacherService = TestBed.inject(TeacherService);
    spyOn(teacherService, 'updateIsLockedAfterEndDate').and.returnValue(of({}));
    component.updateIsLockedAfterEndDate();
    expect(teacherService.updateIsLockedAfterEndDate).toHaveBeenCalledWith(1, true);
  });

  it('should enable is locked after end date checkbox', () => {
    component.endDate = new Date();
    component.isLockedAfterEndDateCheckboxEnabled = false;
    const teacherService = TestBed.inject(TeacherService);
    spyOn(teacherService, 'updateIsLockedAfterEndDate').and.returnValue(of({}));
    component.updateLockedAfterEndDateCheckbox();
    expect(component.isLockedAfterEndDateCheckboxEnabled).toEqual(true);
  });

  it('should disable is locked after end date checkbox', () => {
    component.endDate = null;
    component.isLockedAfterEndDateCheckboxEnabled = true;
    const teacherService = TestBed.inject(TeacherService);
    spyOn(teacherService, 'updateIsLockedAfterEndDate').and.returnValue(of({}));
    component.updateLockedAfterEndDateCheckbox();
    expect(component.isLockedAfterEndDateCheckboxEnabled).toEqual(false);
  });

  it('should translate message code', () => {
    const message = component.translateMessageCode('periodNameAlreadyExists');
    expect(message).toEqual('There is already a period with that name.');
  });

  surveyRun();
});

function surveyRun() {
  describe('Survey Run', () => {
    beforeEach(() => {
      component['isDefaultRun'] = false;
      fixture.detectChanges();
    });

    it('should hide Student Per Team section', () => {
      const radioGroup = fixture.debugElement.nativeElement.querySelector('mat-radio-group');
      expect(radioGroup).toBeNull();
    });
  });
}
