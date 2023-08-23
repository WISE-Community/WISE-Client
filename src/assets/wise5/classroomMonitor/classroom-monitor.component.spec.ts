import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from './classroom-monitor-testing.module';
import { ClassroomMonitorComponent } from './classroom-monitor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: ClassroomMonitorComponent;
let fixture: ComponentFixture<ClassroomMonitorComponent>;
describe('ClassroomMonitorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassroomMonitorComponent],
      imports: [ClassroomMonitorTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomMonitorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
