import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import sampleConfig1 from './sampleData/sample_config_1.json';
let service: ConfigService;
let http: HttpTestingController;

let configJSON;
const studentUserId = 3;
const studentWorkgroupId = 300;
const teacherUserId = 1;
const teacherUserId2 = 2;
const teacherUsername = 'Spongebob';
const teacherUsername2 = 'Patrick';
const teacherWorkgroupId = 101;
const teacherWorkgroupId2 = 102;

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });
    http = TestBed.get(HttpTestingController);
    service = TestBed.get(ConfigService);
    configJSON = {
      startTime: new Date(2020, 4, 10).getTime(),
      endTime: new Date(2020, 4, 20).getTime(),
      timestampDiff: 0,
      isLockedAfterEndDate: false,
      userInfo: {
        myUserInfo: {
          myClassInfo: {
            teacherUserInfo: {
              userId: teacherUserId,
              username: teacherUsername,
              workgroupId: teacherWorkgroupId
            },
            sharedTeacherUserInfos: [
              {
                userId: teacherUserId2,
                username: teacherUsername2,
                workgroupId: teacherWorkgroupId2
              }
            ]
          }
        }
      }
    };
    service.setConfig(configJSON);
  });

  retrieveConfig();
  sortTheClassmatesAlphabeticallyByNameWhenSettingConfig();
  getLocale();
  getMode();
  getPeriodIdOfStudent();
  getPeriodsInRun();
  getUsernameByWorkgroupId();
  getAllUsersInPeriod();
  getUsersNotInWorkgroupInPeriod();
  getTeacherWorkgroupId();
  getSharedTeacherWorkgroupIds();
  getTeacherWorkgroupIds();
  getPeriodIdGivenWorkgroupId();
  calculateIsRunActive();
  isEndedAndLocked();
  isTeacherIdentifyingId();
  getTeacherUsername();
});

function retrieveConfig() {
  it('should retrieve config', () => {
    const configURL = 'http://localhost:8080/wise/config/1';
    service.retrieveConfig(configURL).subscribe((response) => {
      expect(response).toEqual(sampleConfig1);
    });
    http.expectOne(configURL).flush(sampleConfig1);
  });
}

function sortTheClassmatesAlphabeticallyByNameWhenSettingConfig() {
  it('should sort the classmates alphabetically by name when setting config', () => {
    const classmateUserInfos = sampleConfig1.userInfo.myUserInfo.myClassInfo.classmateUserInfos;
    service.setConfig(sampleConfig1);
    expect(classmateUserInfos[0].workgroupId).toEqual(8);
    expect(classmateUserInfos[1].workgroupId).toEqual(3);
  });
}

function getLocale() {
  it('should get locale in config', () => {
    service.setConfig({ locale: 'ja' });
    expect(service.getLocale()).toEqual('ja');
  });
  it('should get default locale if config does not specify', () => {
    service.setConfig({});
    expect(service.getLocale()).toEqual('en');
  });
}

function getMode() {
  it('should get modes', () => {
    service.setConfig({ mode: 'run' });
    expect(service.getMode()).toEqual('run');
    expect(service.isPreview()).toEqual(false);

    service.setConfig({ mode: 'preview' });
    expect(service.getMode()).toEqual('preview');
    expect(service.isPreview()).toEqual(true);
  });
}

function getPeriodIdOfStudent() {
  it('should get period id of student', () => {
    service.setConfig({ userInfo: { myUserInfo: { periodId: 1 } } });
    expect(service.getPeriodId()).toEqual(1);
  });
}

function getPeriodsInRun() {
  it('should get periods in the run', () => {
    service.setConfig(sampleConfig1);
    expect(service.getPeriods().length).toEqual(3);
    expect(service.getPeriods()[2].periodName).toEqual('newperiod');
  });
}

function getUsernameByWorkgroupId() {
  it('should get username by workgroup id', () => {
    service.setConfig(sampleConfig1);
    expect(service.getStudentFirstNamesByWorkgroupId(8)).toEqual(['k']);
  });
  it('should get empty array for non-existing workgroup', () => {
    service.setConfig(sampleConfig1);
    expect(service.getStudentFirstNamesByWorkgroupId(-1).length).toEqual(0);
  });
}

function getAllUsersInPeriod() {
  describe('getAllUsersInPeriod()', () => {
    it('should get all users in period', () => {
      service.setConfig(sampleConfig1);
      expect(service.getAllUsersInPeriod(1).length).toEqual(3);
      expect(service.getAllUsersInPeriod(2).length).toEqual(0);
    });
  });
}

function getUsersNotInWorkgroupInPeriod() {
  describe('getUsersNotInWorkgroupInPeriod()', () => {
    it('should get all users who are not in a workgroup for a given period', () => {
      service.setConfig(sampleConfig1);
      expect(service.getUsersNotInWorkgroupInPeriod(1).length).toEqual(1);
      expect(service.getUsersNotInWorkgroupInPeriod(2).length).toEqual(0);
    });
  });
}

function getTeacherWorkgroupId() {
  it('should get teacher workgroup id from config', () => {
    service.setConfig(sampleConfig1);
    expect(service.getTeacherWorkgroupId()).toEqual(1);
  });
}

function getSharedTeacherWorkgroupIds() {
  it('should get shared teacher workgroup ids from config', () => {
    service.setConfig(sampleConfig1);
    expect(service.getSharedTeacherWorkgroupIds()).toEqual([100, 101]);
  });
}

function getTeacherWorkgroupIds() {
  it('should get shared teacher workgroup ids from config', () => {
    service.setConfig(sampleConfig1);
    expect(service.getTeacherWorkgroupIds()).toEqual([1, 100, 101]);
  });
}

function getPeriodIdGivenWorkgroupId() {
  describe('getPeriodIdByWorkgroupId', () => {
    beforeEach(() => {
      service.setConfig(sampleConfig1);
      spyOn(service, 'getUserInfoByWorkgroupId').and.callThrough();
    });
    it('should return null if given null workgroupId', () => {
      expect(service.getPeriodIdByWorkgroupId(null)).toBeNull();
    });

    it('should return null if workgroup does not exist', () => {
      expect(service.getPeriodIdByWorkgroupId(-1)).toBeNull();
      expect(service.getUserInfoByWorkgroupId).toHaveBeenCalledWith(-1);
    });

    it("should return workgroup's period id", () => {
      expect(service.getPeriodIdByWorkgroupId(8)).toEqual(1);
      expect(service.getUserInfoByWorkgroupId).toHaveBeenCalledWith(8);
    });
  });
}

function calculateIsRunActive() {
  describe('calculateIsRunActive', () => {
    calculateIsRunActive_RunOnlyHasAStartTime_ReturnWhetherRunIsActive();
    calculateIsRunActive_RunHasAStartTimeAndEndTimeAndIsNotLocked_ReturnWhetherRunIsActive();
    calculateIsRunActive_RunHasAStartTimeAndEndTimeAndIsLocked_ReturnWhetherRunIsActive;
  });
}

function calculateIsRunActive_RunOnlyHasAStartTime_ReturnWhetherRunIsActive() {
  it('should calculate if a run is active when a run only has a start time', () => {
    const configJSON = {
      startTime: new Date(2019, 5, 10).getTime(),
      timestampDiff: 0
    };
    jasmine.clock().mockDate(new Date(2019, 5, 9));
    expect(service.calculateIsRunActive(configJSON)).toBeFalsy();
    jasmine.clock().mockDate(new Date(2019, 5, 10));
    expect(service.calculateIsRunActive(configJSON)).toBeTruthy();
    jasmine.clock().mockDate(new Date(2019, 5, 11));
    expect(service.calculateIsRunActive(configJSON)).toBeTruthy();
  });
}

function calculateIsRunActive_RunHasAStartTimeAndEndTimeAndIsNotLocked_ReturnWhetherRunIsActive() {
  it(`should calculate if a run is active to be true when it has a start time and end time and is
      locked value false`, () => {
    expectIsRunActive(new Date(2020, 4, 15), true);
  });
  it(`should calculate if a run is active to be false when it has a start time and end time and is
      locked value false`, () => {
    expectIsRunActive(new Date(2020, 4, 30), true);
  });
}

function calculateIsRunActive_RunHasAStartTimeAndEndTimeAndIsLocked_ReturnWhetherRunIsActive() {
  configJSON.isLockedAfterEndDate = true;
  it(`should calculate if a run is active to be true when it has a start time and end time and is
      locked value true`, () => {
    expectIsRunActive(new Date(2020, 4, 15), true);
  });
  it(`should calculate if a run is active to be false when it has a start time and end time and is
      locked value true`, () => {
    expectIsRunActive(new Date(2020, 4, 30), false);
  });
}

function expectIsRunActive(date, expectedValue) {
  jasmine.clock().mockDate(date);
  expect(service.calculateIsRunActive(configJSON)).toEqual(expectedValue);
}

function expectIsEndedAndLocked(date, expectedValue) {
  jasmine.clock().mockDate(date);
  expect(service.isEndedAndLocked(configJSON)).toEqual(expectedValue);
}

function isEndedAndLocked() {
  describe('isEndedAndLocked', () => {
    isEndedAndLocked_HasStartTimeAndNoEndTime_ReturnNotEndedAndLocked();
    isEndedAndLocked_HasStartTimeAndEndTimeInFuture_ReturnNotEndedAndLocked();
    isEndedAndLocked_EndTimeInPastButNotLocked_ReturnNotEndedAndLocked();
    isEndedAndLocked_EndTimeInPastAndLocked_ReturnEndedAndLocked();
  });
}

function isEndedAndLocked_HasStartTimeAndNoEndTime_ReturnNotEndedAndLocked() {
  it('should calculate is ended and locked when it has a start time and no end time', () => {
    configJSON.endTime = null;
    expectIsEndedAndLocked(new Date(2020, 4, 11), false);
  });
}

function isEndedAndLocked_HasStartTimeAndEndTimeInFuture_ReturnNotEndedAndLocked() {
  it('should calculate is ended and locked when end time is in the future', () => {
    expectIsEndedAndLocked(new Date(2020, 4, 15), false);
  });
}

function isEndedAndLocked_EndTimeInPastButNotLocked_ReturnNotEndedAndLocked() {
  it('should calculate is ended and locked when end time is in the past but not locked', () => {
    expectIsEndedAndLocked(new Date(2020, 4, 30), false);
  });
}

function isEndedAndLocked_EndTimeInPastAndLocked_ReturnEndedAndLocked() {
  it('should calculate is ended and locked when end time is in the past and locked', () => {
    configJSON.isLockedAfterEndDate = true;
    expectIsEndedAndLocked(new Date(2020, 4, 30), true);
  });
}

function isTeacherIdentifyingId() {
  describe('isTeacherIdentifyingId', () => {
    it('should check if a workgroup id is a teacher workgroup id when it is', () => {
      expect(service.isTeacherIdentifyingId('workgroupId', teacherWorkgroupId)).toEqual(true);
    });
    it('should check if a workgroup id is a teacher workgroup id when it is not', () => {
      expect(service.isTeacherIdentifyingId('workgroupId', studentWorkgroupId)).toEqual(false);
    });
    it('should check if a user id is a teacher user id when it is', () => {
      expect(service.isTeacherIdentifyingId('userId', teacherUserId)).toEqual(true);
    });
    it('should check if a user id is a teacher user id when it is not', () => {
      expect(service.isTeacherIdentifyingId('userId', studentUserId)).toEqual(false);
    });
  });
}

function getTeacherUsername() {
  describe('getTeacherUsername', () => {
    it('should get teacher username', () => {
      expect(service.getTeacherUsername(teacherUserId)).toEqual(teacherUsername);
    });
    it('should get shared teacher username', () => {
      expect(service.getTeacherUsername(teacherUserId2)).toEqual(teacherUsername2);
    });
    it('should return null when there is no teacher with the given user id', () => {
      expect(service.getTeacherUsername(studentUserId)).toEqual(null);
    });
  });
}
