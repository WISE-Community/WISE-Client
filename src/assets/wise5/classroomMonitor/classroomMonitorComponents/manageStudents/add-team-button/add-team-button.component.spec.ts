import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';

import { AddTeamButtonComponent } from './add-team-button.component';

class TeacherDataServiceStub {
  getCurrentPeriodId() {
    return 1;
  }
}

let configService: ConfigService;
const usersInPeriod = [{ id: 1, username: 'ht' }];
describe('AddTeamButtonComponent', () => {
  let component: AddTeamButtonComponent;
  let fixture: ComponentFixture<AddTeamButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTeamButtonComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        ConfigService,
        { provide: TeacherDataService, useClass: TeacherDataServiceStub },
        UpgradeModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    configService = TestBed.inject(ConfigService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamButtonComponent);
    component = fixture.componentInstance;
  });

  it('should be enabled when there are students in the period', () => {
    spyOn(configService, 'getAllUsersInPeriod').and.returnValue(usersInPeriod);
    fixture.detectChanges();
    expect(component.isDisabled).toBeFalsy();
  });

  it('should be disabled when there are no students in the period', () => {
    spyOn(configService, 'getAllUsersInPeriod').and.returnValue([]);
    fixture.detectChanges();
    expect(component.isDisabled).toBeTruthy();
  });
});
