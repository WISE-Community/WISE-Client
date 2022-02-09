import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerAvatarSelectorComponent } from './computer-avatar-selector.component';

describe('ComputerAvatarSelectorComponent', () => {
  let component: ComputerAvatarSelectorComponent;
  let fixture: ComponentFixture<ComputerAvatarSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComputerAvatarSelectorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerAvatarSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should highlight avatar', () => {
    expect(component.avatarSelected).toEqual(undefined);
    const firstAvatar = component.avatars[0];
    component.highlightAvatar(firstAvatar);
    expect(component.avatarSelected).toEqual(firstAvatar);
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
