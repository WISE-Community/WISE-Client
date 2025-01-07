import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolBarComponent } from './tool-bar.component';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { MockComponent } from 'ng-mocks';
import { SelectPeriodComponent } from '../../select-period/select-period.component';

describe('ToolBarComponent', () => {
  let component: ToolBarComponent;
  let fixture: ComponentFixture<ToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(SelectPeriodComponent)],
      imports: [ClassroomMonitorTestingModule, ToolBarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
