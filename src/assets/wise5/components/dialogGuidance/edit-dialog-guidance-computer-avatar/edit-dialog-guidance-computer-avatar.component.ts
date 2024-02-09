import { Component, Input, OnInit } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComputerAvatarSettings } from '../../../common/computer-avatar/ComputerAvatarSettings';

@Component({
  selector: 'edit-dialog-guidance-computer-avatar',
  styleUrls: ['edit-dialog-guidance-computer-avatar.component.scss'],
  templateUrl: './edit-dialog-guidance-computer-avatar.component.html'
})
export class EditDialogGuidanceComputerAvatarComponent implements OnInit {
  @Input() computerAvatarSettings: ComputerAvatarSettings;

  allComputerAvatars: ComputerAvatar[];
  avatarsPath: string;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.allComputerAvatars = this.computerAvatarService.getAvatars();
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    this.populateSelectedComputerAvatars();
    this.componentChanged();
  }

  private populateSelectedComputerAvatars(): void {
    for (const availableComputerAvatar of this.allComputerAvatars) {
      if (this.computerAvatarSettings.ids.includes(availableComputerAvatar.id)) {
        availableComputerAvatar.isSelected = true;
      }
    }
  }

  selectAllComputerAvatars(): void {
    for (const computerAvatar of this.allComputerAvatars) {
      computerAvatar.isSelected = true;
    }
    this.saveSelectedComputerAvatars();
  }

  unselectAllComputerAvatars(): void {
    for (const computerAvatar of this.allComputerAvatars) {
      computerAvatar.isSelected = false;
    }
    // select the first avatar to make sure there is always at least one selected
    this.allComputerAvatars[0].isSelected = true;
    this.saveSelectedComputerAvatars();
  }

  toggleSelectComputerAvatar(computerAvatar: ComputerAvatar): void {
    if (!this.isLastSelectedComputerAvatar(computerAvatar)) {
      computerAvatar.isSelected = !computerAvatar.isSelected;
      this.saveSelectedComputerAvatars();
    }
  }

  isLastSelectedComputerAvatar(computerAvatar: ComputerAvatar): boolean {
    return computerAvatar.isSelected && this.computerAvatarSettings.ids.length === 1;
  }

  saveSelectedComputerAvatars(): void {
    this.computerAvatarSettings.ids = [];
    for (const computerAvatar of this.allComputerAvatars) {
      if (computerAvatar.isSelected) {
        this.computerAvatarSettings.ids.push(computerAvatar.id);
      }
    }
    this.componentChanged();
  }

  componentChanged(): void {
    this.projectService.nodeChanged();
  }
}
