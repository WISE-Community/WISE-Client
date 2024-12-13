import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentGradingViewComponent } from './component-grading-view.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';

describe('ComponentGradingViewComponent', () => {
  let component: ComponentGradingViewComponent;
  let fixture: ComponentFixture<ComponentGradingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ComponentGradingViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentGradingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
