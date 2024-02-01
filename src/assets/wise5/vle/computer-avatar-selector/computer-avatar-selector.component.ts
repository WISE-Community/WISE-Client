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
  label: string;

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
    this.initializeLabel();
  }

  filterAvatars(allAvatars: ComputerAvatar[], avatarIdsToUse: string[]): ComputerAvatar[] {
    return allAvatars.filter((avatar) => avatarIdsToUse.includes(avatar.id));
  }

  initializeLabel(): void {
    const computerAvatarSettingsLabel = this.computerAvatarSettings.label;
    if (computerAvatarSettingsLabel == null || computerAvatarSettingsLabel === '') {
      this.label = this.computerAvatarService.getDefaultComputerAvatarLabel();
    } else {
      this.label = computerAvatarSettingsLabel;
    }
  }

  chooseAvatar(): void {
    this.chooseAvatarEvent.emit(this.avatarSelected);
  }
}
