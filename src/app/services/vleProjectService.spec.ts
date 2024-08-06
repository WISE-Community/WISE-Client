import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VLEProjectService } from '../../assets/wise5/vle/vleProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
let service: VLEProjectService;
let http: HttpTestingController;

describe('VLEProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(VLEProjectService);
  });
  shouldGetTheExpectedPreviousScore();
  shouldGetTheExpectedCurrentScore();
  shouldCorrectlyCalculateIsScoreMatchTrue();
  shouldCorrectlyCalculateIsScoreMatchFalse();
  shouldGetNotificationByScore();
});

function shouldGetTheExpectedPreviousScore() {
  it('should get the expected previous score', () => {
    const scoreSequence = [3, 5];
    expect(service.getExpectedPreviousScore(scoreSequence)).toEqual(3);
  });
}

function shouldGetTheExpectedCurrentScore() {
  it('should get the expected current score', () => {
    const scoreSequence = [3, 5];
    expect(service.getExpectedCurrentScore(scoreSequence)).toEqual(5);
  });
}

function shouldCorrectlyCalculateIsScoreMatchTrue() {
  it('should correctly calculate isScoreMatch() true', () => {
    expect(service.isScoreMatch(1, '1, 2, 3')).toBe(true);
    expect(service.isScoreMatch(2, '1, 2, 3')).toBe(true);
    expect(service.isScoreMatch(3, '1, 2, 3')).toBe(true);
  });
}

function shouldCorrectlyCalculateIsScoreMatchFalse() {
  it('should correctly calculate isScoreMatch() false', () => {
    expect(service.isScoreMatch(4, '1, 2, 3')).toBe(false);
  });
}

function shouldGetNotificationByScore() {
  it('should get notification by score', () => {
    const component = {
      notificationSettings: {
        notifications: [
          {
            enableCriteria: {
              scoreSequence: ['0, 1, 2, 3, 4, 5', '0, 1, 2']
            },
            notificationMessageToTeacher: '{{username}} needs a lot of help'
          },
          {
            enableCriteria: {
              scoreSequence: ['0, 1, 2, 3, 4, 5', '3']
            },
            notificationMessageToTeacher: '{{username}} needs some help'
          }
        ]
      }
    };
    let notification = service.getNotificationByScore(component, 3, 2);
    expect(notification.notificationMessageToTeacher).toEqual('{{username}} needs a lot of help');
    notification = service.getNotificationByScore(component, 2, 3);
    expect(notification.notificationMessageToTeacher).toEqual('{{username}} needs some help');
    notification = service.getNotificationByScore(component, 2, 5);
    expect(notification).toEqual(null);
  });
}
