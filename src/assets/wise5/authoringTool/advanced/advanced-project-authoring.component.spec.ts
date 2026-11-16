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
      'hideJSONValidMessage'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdvancedProjectAuthoringComponent],
      providers: [
        { provide: ConfigService, useValue: {} },
        { provide: NotificationService, useValue: notificationService },
        { provide: TeacherProjectService, useValue: {} },
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedProjectAuthoringComponent);
    component = fixture.componentInstance;
    component['projectJSONString'] = '{ invalid JSON';
  });

  it('does not show the valid JSON message when opening the JSON tab with invalid JSON', () => {
    component['tabChanged']({ index: 2 } as MatTabChangeEvent);

    expect(notificationService.showJSONValidMessage).not.toHaveBeenCalled();
  });

  it('does not prompt or hide the JSON message when leaving the JSON tab with invalid JSON', () => {
    spyOn(window, 'confirm');

    component['tabChanged']({ index: 0 } as MatTabChangeEvent);

    expect(window.confirm).not.toHaveBeenCalled();
    expect(notificationService.hideJSONValidMessage).not.toHaveBeenCalled();
  });
});
