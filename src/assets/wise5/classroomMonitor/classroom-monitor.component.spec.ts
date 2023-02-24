import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { ClassroomMonitorTestingModule } from './classroom-monitor-testing.module';
import { ClassroomMonitorComponent } from './classroom-monitor.component';

class MockUpgradeModule {
  $injector = {
    get() {}
  };
}

let component: ClassroomMonitorComponent;
let fixture: ComponentFixture<ClassroomMonitorComponent>;
describe('ClassroomMonitorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassroomMonitorComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [
        {
          provide: UpgradeModule,
          useClass: MockUpgradeModule
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomMonitorComponent);
    component = fixture.componentInstance;
  });

  it('should create with undefined view name', () => {
    expect(component.currentViewName).toEqual(undefined);
  });
});
