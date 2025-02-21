import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentGradingViewComponent } from './component-grading-view.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponents } from 'ng-mocks';
import { ClassResponsesComponent } from '../class-responses/class-responses.component';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';

describe('ComponentGradingViewComponent', () => {
  let component: ComponentGradingViewComponent;
  let fixture: ComponentFixture<ComponentGradingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponents(
          ClassResponsesComponent,
          MilestoneReportButtonComponent,
          PeerGroupButtonComponent
        )
      ],
      imports: [ClassroomMonitorTestingModule, ComponentGradingViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { params: of({ nodeId: 'node1' }) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentGradingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
