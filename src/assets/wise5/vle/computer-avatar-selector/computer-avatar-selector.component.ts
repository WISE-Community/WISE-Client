import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComputerAvatar } from '../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComputerAvatarSettings } from '../../components/dialogGuidance/ComputerAvatarSettings';

@Component({
  selector: 'computer-avatar-selector',
  templateUrl: './computer-avatar-selector.component.html',
  styleUrls: ['./computer-avatar-selector.component.scss']
})
export class ComputerAvatarSelectorComponent implements OnInit {
  @Input()
  computerAvatarSettings: ComputerAvatarSettings;

  @Output()
  chooseAvatarEvent = new EventEmitter<ComputerAvatar>();

  avatars: ComputerAvatar[];
  avatarSelected: ComputerAvatar;
  avatarsPath: string;

  constructor(private computerAvatarService: ComputerAvatarService) {}

  ngOnInit(): void {
    this.avatars = this.filterAvatars(
      this.computerAvatarService.getAvatars(),
      this.computerAvatarSettings.ids
    );
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    if (this.avatars.length === 1) {
      this.avatarSelected = this.avatars[0];
    }
  }

  filterAvatars(allAvatars: ComputerAvatar[], avatarIdsToUse: any): ComputerAvatar[] {
    const avatars = [];
    for (const avatar of allAvatars) {
      if (avatarIdsToUse[avatar.id] === true) {
        avatars.push(avatar);
      }
    }
    return avatars;
  }

  highlightAvatar(avatarClicked: ComputerAvatar): void {
    for (const avatar of this.avatars) {
      if (avatar.id === avatarClicked.id) {
        avatar.isSelected = true;
        this.avatarSelected = avatarClicked;
      } else {
        avatar.isSelected = false;
      }
    }
  }

  chooseAvatar(): void {
    delete this.avatarSelected.isSelected;
    this.chooseAvatarEvent.emit(this.avatarSelected);
  }
}
