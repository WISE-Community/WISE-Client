import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComputerAvatar } from '../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../services/computerAvatarService';

@Component({
  selector: 'computer-avatar-selector',
  templateUrl: './computer-avatar-selector.component.html',
  styleUrls: ['./computer-avatar-selector.component.scss']
})
export class ComputerAvatarSelectorComponent implements OnInit {
  @Input()
  avatarIds: any;

  @Input()
  label: string;

  @Input()
  prompt: string;

  @Output()
  chooseAvatarEvent = new EventEmitter<string>();

  avatars: ComputerAvatar[];
  avatarSelected: any;
  avatarsPath: string;

  constructor(private computerAvatarService: ComputerAvatarService) {}

  ngOnInit(): void {
    this.avatars = this.filterAvatars(this.computerAvatarService.getAvatars(), this.avatarIds);
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    if (this.prompt == null || this.prompt === '') {
      this.prompt =
        'Discuss your answer with a thought partner!\n' +
        'Your partner will ask you to explain your thinking and will compare your response to ' +
        'responses from other students around the world.\n' +
        'Then your partner will ask some questions to help you.';
    }
    if (this.label == null || this.label === '') {
      this.label = 'Thought Partner';
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

  highlightAvatar(avatar: any): void {
    this.avatars.forEach((avatar) => delete avatar.isSelected);
    avatar.isSelected = true;
    this.avatarSelected = avatar;
  }

  chooseAvatar(): void {
    delete this.avatarSelected.isSelected;
    this.chooseAvatarEvent.emit(this.avatarSelected.id);
  }
}
