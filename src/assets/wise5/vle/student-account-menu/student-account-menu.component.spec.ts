import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { StudentAccountMenuComponent } from './student-account-menu.component';

class MockProjectService {
  rootNode = {};

  getThemeSettings() {
    return {};
  }
}

describe('StudentAccountMenuComponent', () => {
  let component: StudentAccountMenuComponent;
  let fixture: ComponentFixture<StudentAccountMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDividerModule, MatIconModule, UpgradeModule],
      declarations: [StudentAccountMenuComponent],
      providers: [
        AnnotationService,
        ConfigService,
        { provide: ProjectService, useClass: MockProjectService },
        SessionService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAccountMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get usernames display', () => {
    const name1 = 'Spongebob Squarepants';
    const name2 = 'Patrick Star';
    const users = [{ name: name1 }, { name: name2 }];
    const usernamesDisplay = component.getUsernamesDisplay(users);
    expect(usernamesDisplay).toEqual(`${name1}, ${name2}`);
  });

  it('should go home', () => {
    const saveEventSpy = spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent');
    const goHomeSpy = spyOn(TestBed.inject(SessionService), 'goHome');
    component.goHome();
    expect(saveEventSpy).toHaveBeenCalled();
    expect(goHomeSpy).toHaveBeenCalled();
  });

  it(
    'should log out',
    waitForAsync(() => {
      const saveEventSpy = spyOn(
        TestBed.inject(StudentDataService),
        'saveVLEEvent'
      ).and.returnValue(Promise.resolve({}));
      const logOutSpy = spyOn(TestBed.inject(SessionService), 'logOut');
      component.logOut();
      expect(saveEventSpy).toHaveBeenCalled();
      fixture.whenStable().then(() => {
        expect(logOutSpy).toHaveBeenCalled();
      });
    })
  );
});
