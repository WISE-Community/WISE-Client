import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfigService } from '../../services/configService';
import { NotificationService } from '../../services/notificationService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { AdvancedProjectAuthoringComponent } from './advanced-project-authoring.component';
import { UserService } from '../../../../app/services/user.service';

describe('AdvancedProjectAuthoringComponent', () => {
  let component: AdvancedProjectAuthoringComponent;
  let fixture: ComponentFixture<AdvancedProjectAuthoringComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notificationService = jasmine.createSpyObj('NotificationService', [
      'showJSONValidMessage',
      'showJSONInvalidMessage',
      'hideJSONValidMessage'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdvancedProjectAuthoringComponent],
      providers: [
        { provide: ConfigService, useValue: {} },
        { provide: NotificationService, useValue: notificationService },
        {
          provide: TeacherProjectService,
          useValue: {
            setProject: jasmine.createSpy('setProject'),
            checkPotentialStartNodeIdChangeThenSaveProject: jasmine.createSpy(
              'checkPotentialStartNodeIdChangeThenSaveProject'
            )
          }
        },
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedProjectAuthoringComponent);
    component = fixture.componentInstance;
    component['projectJSONString'] = '{ invalid JSON';
  });

  it('shows the invalid JSON message when opening the JSON tab with invalid JSON', () => {
    component['tabChanged']({ index: 3 } as MatTabChangeEvent);
    expect(notificationService.showJSONInvalidMessage).toHaveBeenCalled();
  });

  it('shows the valid JSON message when opening the JSON tab with valid JSON', () => {
    component['projectJSONString'] = '{"valid": true}';
    component['tabChanged']({ index: 3 } as MatTabChangeEvent);
    expect(notificationService.showJSONValidMessage).toHaveBeenCalled();
  });

  it('updates the JSON message when the JSON text changes', () => {
    component['tabChanged']({ index: 3 } as MatTabChangeEvent);
    component['projectJSONString'] = '{"valid": true}';
    component['saveProjectJSONString']();
    expect(notificationService.showJSONValidMessage).toHaveBeenCalled();
    component['projectJSONString'] = '{ invalid JSON';
    component['saveProjectJSONString']();
    expect(notificationService.showJSONInvalidMessage).toHaveBeenCalledTimes(2);
  });

  it('hides the JSON message when leaving the JSON tab', () => {
    component['tabChanged']({ index: 3 } as MatTabChangeEvent);
    component['tabChanged']({ index: 1 } as MatTabChangeEvent);
    expect(notificationService.hideJSONValidMessage).toHaveBeenCalled();
  });
});
