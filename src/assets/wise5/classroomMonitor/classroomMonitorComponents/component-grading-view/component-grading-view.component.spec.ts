import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentGradingViewComponent } from './component-grading-view.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';

xdescribe('ComponentGradingViewComponent', () => {
  let component: ComponentGradingViewComponent;
  let fixture: ComponentFixture<ComponentGradingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassroomMonitorTestingModule,
        ComponentGradingViewComponent,
        MockComponent(MilestoneReportButtonComponent)
      ],
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
