import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';

import { StepItemComponent } from './step-item.component';

describe('StepItemComponent', () => {
  let component: StepItemComponent;
  let fixture: ComponentFixture<StepItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepItemComponent],
      imports: [ClassroomMonitorTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
