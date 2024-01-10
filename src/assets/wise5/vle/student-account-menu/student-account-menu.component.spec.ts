import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { StudentAccountMenuComponent } from './student-account-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockProjectService {
  rootNode = {};

  getMaxScoreForNode(nodeId: string): number {
    if (nodeId === 'node1') {
      return 1;
    } else if (nodeId === 'node2') {
      return 2;
    } else if (nodeId === 'node3') {
      return 3;
    }
  }

  getThemeSettings() {
    return {};
  }

  getProjectRootNode() {
    return {};
  }

  isGroupNode(nodeId: string): boolean {
    return nodeId.startsWith('group');
  }
}

describe('StudentAccountMenuComponent', () => {
  let component: StudentAccountMenuComponent;
  let fixture: ComponentFixture<StudentAccountMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [StudentAccountMenuComponent],
      providers: [{ provide: ProjectService, useClass: MockProjectService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    const studentDataService = TestBed.inject(StudentDataService);
    studentDataService.nodeStatuses = {
      node1: {
        nodeId: 'node1',
        isVisible: true
      },
      node2: {
        nodeId: 'node2',
        isVisible: true
      },
      node3: {
        nodeId: 'node3',
        isVisible: true
      }
    };
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

  it('should set the max score', () => {
    expect(component.maxScore).toEqual(6);
  });
});
