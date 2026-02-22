import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentSummaryComponent } from './component-summary.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { ComponentCompletionComponent } from '../component-completion/component-completion.component';
import { By } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { CRaterService } from '../../../services/cRaterService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { SummaryService } from '../../../components/summary/summaryService';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';

let component: ComponentSummaryComponent;
let fixture: ComponentFixture<ComponentSummaryComponent>;
describe('ComponentSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentSummaryComponent,
        MockComponents(
          ComponentCompletionComponent,
          MilestoneReportButtonComponent,
          PeerGroupButtonComponent
        )
      ],
      providers: [
        MockProviders(
          AnnotationService,
          ComponentServiceLookupService,
          CRaterService,
          SummaryService
        ),
        MockProvider(TeacherDataService, {
          currentPeriodChanged$: of({ currentPeriod: { periodId: 1 } })
        }),
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
