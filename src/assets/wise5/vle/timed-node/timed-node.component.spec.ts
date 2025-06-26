import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimedNodeComponent } from './timed-node.component';
import { TimedNodeService } from '../../services/timedNodeService';
import { Node } from '../../common/Node';
import { MockProviders } from 'ng-mocks';
import { ComponentService } from '../../components/componentService';
import { ConfigService } from '../../services/configService';
import { ConstraintService } from '../../services/constraintService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { StudentNodeService } from '../../services/studentNodeService';
import { VLEProjectService } from '../vleProjectService';

describe('TimedNodeComponent', () => {
  let component: TimedNodeComponent;
  let fixture: ComponentFixture<TimedNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimedNodeComponent],
      providers: [
        MockProviders(
          ComponentService,
          ConfigService,
          ConstraintService,
          StudentNodeService,
          NodeStatusService,
          VLEProjectService,
          SessionService,
          StudentDataService,
          TimedNodeService
        )
      ]
    }).compileComponents();
    spyOn(TestBed.inject(TimedNodeService), 'broadcastIsNodeCompleted');
    spyOn(TestBed.inject(ConfigService), 'isPreview').and.returnValue(false);
    spyOn(
      TestBed.inject(StudentDataService),
      'retrieveStudentDataForSignedInStudent'
    ).and.returnValue(
      new Promise(() => {
        events: [];
      })
    );

    fixture = TestBed.createComponent(TimedNodeComponent);
    component = fixture.componentInstance;
    component.node = new Node();
    component.node.components = [{ id: 'c1', type: 'DG', timeLimit: 5 }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show timer and proceed button if unfinished', () => {
    expect(fixture.nativeElement.querySelector('.timed-node-tools')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.step-completed')).toBeNull();
  });

  it('should show step completed message if finished', () => {
    component['stepCompleted'] = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.timed-node-tools')).toBeNull();
    expect(fixture.nativeElement.querySelector('.step-completed')).toBeTruthy();
  });
});
