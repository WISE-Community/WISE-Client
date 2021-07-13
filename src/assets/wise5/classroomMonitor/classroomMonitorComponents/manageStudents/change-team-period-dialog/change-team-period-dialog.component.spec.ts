import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

import { ChangeTeamPeriodDialogComponent } from './change-team-period-dialog.component';

class ConfigServiceStub {
  getPeriods() {
    return [{ periodId: -1 }, { periodId: 1 }, { periodId: 2 }];
  }
  getRunId() {
    return 123;
  }
}

const team = {
  periodId: 1,
  username: 'Oski Bear (oskib0101)',
  workgroupId: 10
};

let component: ChangeTeamPeriodDialogComponent;
let http: HttpTestingController;
describe('ChangeTeamPeriodDialogComponent', () => {
  let fixture: ComponentFixture<ChangeTeamPeriodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeTeamPeriodDialogComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: team }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChangeTeamPeriodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  ngOnInit_filterPeriods();
  changePeriod_makeRequestToChangePeriod();
});

function ngOnInit_filterPeriods() {
  describe('ngOnInit()', () => {
    it('should create and filter periods', () => {
      expect(component).toBeTruthy();
      expect(component.periods.length).toEqual(1);
      expect(component.periods[0].periodId).toEqual(2);
    });
  });
}

function changePeriod_makeRequestToChangePeriod() {
  describe('changePeriod()', () => {
    it('should make request to change the period and then to retrieve config', () => {
      component.selectedPeriod = { periodId: 2 };
      component.changePeriod();
      const req = http.expectOne(`/api/teacher/run/123/team/10/change-period`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(2);
      req.flush({});
      http.verify();
    });
  });
}
