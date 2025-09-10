import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentSummaryComponent } from './component-summary.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponents } from 'ng-mocks';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { ComponentCompletionComponent } from '../component-completion/component-completion.component';
import { By } from '@angular/platform-browser';

let component: ComponentSummaryComponent;
let fixture: ComponentFixture<ComponentSummaryComponent>;
describe('ComponentSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassroomMonitorTestingModule,
        ComponentSummaryComponent,
        MockComponents(ComponentCompletionComponent, MilestoneReportButtonComponent)
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { params: of({ nodeId: 'node1' }) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentSummaryComponent);
    component = fixture.componentInstance;
    component.node = { id: 'node1', title: 'Node 1' } as any;
    component.component = { id: 'abc', prompt: 'hi' } as any;
    fixture.detectChanges();
  });
  testHasStudentWork();
  testNoStudentWork();
});

function testHasStudentWork() {
  describe('has student work', () => {
    beforeEach(() => {
      component['hasStudentWork'] = true;
      fixture.detectChanges();
    });
    it('should show component completion', () => {
      expect(getComponentCompletion()).toBeTruthy();
    });
  });
}

function testNoStudentWork() {
  describe('no student work', () => {
    beforeEach(() => {
      component['hasStudentWork'] = false;
      fixture.detectChanges();
    });
    it('should not show component completion', () => {
      expect(getComponentCompletion()).toBeFalsy();
    });
  });
}

function getComponentCompletion() {
  return fixture.debugElement.query(By.css('component-completion'));
}
