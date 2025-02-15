import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentWorkgroupItemComponent } from './component-workgroup-item.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';

describe('ComponentWorkgroupItemComponent', () => {
  let component: ComponentWorkgroupItemComponent;
  let fixture: ComponentFixture<ComponentWorkgroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ComponentWorkgroupItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentWorkgroupItemComponent);
    component = fixture.componentInstance;
    component.workgroupData = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
