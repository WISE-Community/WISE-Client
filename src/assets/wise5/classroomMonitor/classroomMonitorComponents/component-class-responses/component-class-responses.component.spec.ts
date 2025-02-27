import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentClassResponsesComponent } from './component-class-responses.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { TeacherDataService } from '../../../services/teacherDataService';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { ConfigService } from '../../../services/configService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { Node } from '../../../common/Node';
import { By } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { Annotation } from '../../../common/Annotation';
import { NotificationService } from '../../../services/notificationService';
import { CompletionStatus } from '../shared/CompletionStatus';

let component: ComponentClassResponsesComponent;
let fixture: ComponentFixture<ComponentClassResponsesComponent>;
describe('ComponentClassResponsesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(WorkgroupSelectAutocompleteComponent)],
      imports: [ComponentClassResponsesComponent, ClassroomMonitorTestingModule]
    }).compileComponents();
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(of({}));
    spyOn(TestBed.inject(TeacherDataService), 'isWorkgroupShown').and.returnValue(true);
    spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue([
      // team 1 does not have a score (should appear as '-' in the page)
      { toWorkgroupId: 2, data: { value: 4 }, type: 'score' } as Annotation,
      { toWorkgroupId: 3, data: { value: 2 }, type: 'score' } as Annotation,
      { toWorkgroupId: 4, data: { value: 1 }, type: 'score' } as Annotation,
      { toWorkgroupId: 5, data: { value: 5 }, type: 'score' } as Annotation
    ]);
    spyOn(TestBed.inject(ClassroomStatusService), 'hasStudentStatus').and.returnValue(true);
    spyOn(TestBed.inject(ClassroomStatusService), 'getStudentStatusForWorkgroupId').and.returnValue(
      { nodeStatuses: {} }
    );
    spyOn(TestBed.inject(NotificationService), 'getAlertNotifications').and.returnValue([]);
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([
      { workgroupId: 1 },
      { workgroupId: 2 },
      { workgroupId: 3 },
      { workgroupId: 4 },
      { workgroupId: 5 }
    ]);
    fixture = TestBed.createComponent(ComponentClassResponsesComponent);
    component = fixture.componentInstance;
    component['node'] = { id: 'node1' } as Node;
    component['component'] = { id: 'component1' };
    component['getCompletionStatusByWorkgroupId'] = () => new CompletionStatus();
    fixture.detectChanges();
  });
  ngOnInit();
  sortByTeam();
  sortByScore();
});

function ngOnInit() {
  describe('ngOnInit', () => {
    it('should display workgroups', () => {
      expect(component).toBeTruthy();
      expectWorkgroupItemsInOrder(['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5']);
    });
  });
}

function sortByTeam() {
  describe('sortByTeam', () => {
    it('should sort workgroups by team', () => {
      const sortByTeamButton = fixture.debugElement
        .queryAll(By.css('button'))
        .find((element) => element.nativeElement.textContent.trim().includes('Team'));
      // sort descending
      sortByTeamButton.nativeElement.click();
      fixture.detectChanges();
      expectWorkgroupItemsInOrder(['Team 5', 'Team 4', 'Team 3', 'Team 2', 'Team 1']);

      // sort ascending when the button is clicked again
      sortByTeamButton.nativeElement.click();
      fixture.detectChanges();
      expectWorkgroupItemsInOrder(['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5']);
    });
  });
}

function sortByScore() {
  describe('sortByScore', () => {
    it('should sort workgroups by score', () => {
      const sortByTeamButton = fixture.debugElement
        .queryAll(By.css('button'))
        .find((element) => element.nativeElement.textContent.trim().includes('Score'));
      // sort ascending
      sortByTeamButton.nativeElement.click();
      fixture.detectChanges();
      expectWorkgroupItemsInOrder(['Team 1', 'Team 4', 'Team 3', 'Team 2', 'Team 5']);

      // sort descending when the button is clicked again
      sortByTeamButton.nativeElement.click();
      fixture.detectChanges();
      expectWorkgroupItemsInOrder(['Team 5', 'Team 2', 'Team 3', 'Team 4', 'Team 1']);
    });
  });
}

function getWorkgroupItems() {
  return fixture.debugElement.queryAll(By.css('component-workgroup-item'));
}

function expectWorkgroupItemsInOrder(workgroupNames: string[]) {
  const workgroupItems = getWorkgroupItems();
  expect(workgroupItems.length).toBe(workgroupNames.length);
  workgroupNames.forEach((workgroupName, index) => {
    expect(workgroupItems[index].nativeElement.textContent).toContain(workgroupName);
  });
}
