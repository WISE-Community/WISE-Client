import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradingStepToolsComponent } from './grading-step-tools.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { Router } from '@angular/router';

describe('GradingStepToolsComponent', () => {
  let component: GradingStepToolsComponent;
  let fixture: ComponentFixture<GradingStepToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingStepToolsComponent, ClassroomMonitorTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GradingStepToolsComponent);
    spyOn(TestBed.inject(Router), 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
