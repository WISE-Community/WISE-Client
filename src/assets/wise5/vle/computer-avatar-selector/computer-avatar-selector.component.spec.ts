import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerAvatar } from '../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComputerAvatarSelectorComponent } from './computer-avatar-selector.component';

describe('ComputerAvatarSelectorComponent', () => {
  const avatars: ComputerAvatar[] = [
    new ComputerAvatar('robot', 'Robot', 'robot.png'),
    new ComputerAvatar('monkey', 'Monkey', 'monkey.png')
  ];
  let component: ComputerAvatarSelectorComponent;
  let fixture: ComponentFixture<ComputerAvatarSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComputerAvatarSelectorComponent],
      providers: [ComputerAvatarService]
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

  it('should highlight avatar', () => {
    expect(component.avatarSelected).toEqual(undefined);
    const firstAvatar = component.avatars[0];
    component.highlightAvatar(firstAvatar);
    expect(firstAvatar.isSelected).toBeTrue();
    expect(component.avatars[1].isSelected).toBeFalsy();
  });

  it('should choose avatar', () => {
    const firstAvatar = component.avatars[0];
    firstAvatar.isSelected = true;
    component.avatarSelected = firstAvatar;
    const confirmSelectionEmitSpy = spyOn(component.chooseAvatarEvent, 'emit');
    component.chooseAvatar();
    expect(firstAvatar.isSelected).toEqual(undefined);
    expect(confirmSelectionEmitSpy).toHaveBeenCalled();
  });
});
