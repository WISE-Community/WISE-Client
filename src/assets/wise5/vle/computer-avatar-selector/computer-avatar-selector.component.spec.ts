import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerAvatar } from '../../common/computer-avatar/ComputerAvatar';
import { DialogGuidanceService } from '../../components/dialogGuidance/dialogGuidanceService';
import { AnnotationService } from '../../services/annotationService';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { ComputerAvatarSelectorComponent } from './computer-avatar-selector.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

describe('ComputerAvatarSelectorComponent', () => {
  const avatars: ComputerAvatar[] = [
    new ComputerAvatar('robot', 'Robot', 'robot.png'),
    new ComputerAvatar('monkey', 'Monkey', 'monkey.png')
  ];
  let component: ComputerAvatarSelectorComponent;
  let fixture: ComponentFixture<ComputerAvatarSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, MatButtonToggleModule, MatCardModule, MatDividerModule],
      declarations: [ComputerAvatarSelectorComponent],
      providers: [
        AnnotationService,
        ComputerAvatarService,
        ConfigService,
        DialogGuidanceService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerAvatarSelectorComponent);
    spyOn(TestBed.inject(ComputerAvatarService), 'getAvatars').and.returnValue(avatars);
    component = fixture.componentInstance;
    component.computerAvatarSettings = {
      ids: ['robot', 'monkey'],
      label: 'Thought buddy',
      prompt: 'Discuss with your thought buddy',
      initialResponse: 'What do you think about...'
    };
    fixture.detectChanges();
  });

  it('should choose avatar', () => {
    const firstAvatar = component.avatars[0];
    component.avatarSelected = firstAvatar;
    const confirmSelectionEmitSpy = spyOn(component.chooseAvatarEvent, 'emit');
    component.chooseAvatar();
    expect(confirmSelectionEmitSpy).toHaveBeenCalled();
  });
});
