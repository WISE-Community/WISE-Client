import { Component, Input, OnInit } from '@angular/core';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComputerAvatarSettings } from '../ComputerAvatarSettings';

@Component({
  selector: 'edit-dialog-guidance-computer-avatar',
  styleUrls: ['edit-dialog-guidance-computer-avatar.component.scss'],
  templateUrl: './edit-dialog-guidance-computer-avatar.component.html'
})
export class EditDialogGuidanceComputerAvatarComponent implements OnInit {
  @Input() computerAvatarSettings: ComputerAvatarSettings;

  allComputerAvatars: ComputerAvatar[];
  avatarsPath: string;
  numSelectedComputerAvatars: number;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.allComputerAvatars = this.computerAvatarService.getAvatars();
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    this.tryInitializeComputerAvatarIds();
    this.populateAndUpdateNumSelectedComputerAvatars();
  }

  private populateAndUpdateNumSelectedComputerAvatars(): void {
    this.populateSelectedComputerAvatars();
    this.updateNumSelectedComputerAvatars();
    this.componentChanged();
  }

  private tryInitializeComputerAvatarIds(): void {
    if (this.computerAvatarSettings.ids == null) {
      this.computerAvatarSettings.ids = [];
      this.selectAllComputerAvatars();
    }
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
    this.saveAndUpdateNumComputerAvatars();
  }

  unselectAllComputerAvatars(): void {
    for (const computerAvatar of this.allComputerAvatars) {
      computerAvatar.isSelected = false;
    }
    // select the first avatar to make sure there is always at least one selected
    this.allComputerAvatars[0].isSelected = true;
    this.saveAndUpdateNumComputerAvatars();
  }

  toggleSelectComputerAvatar(computerAvatar: ComputerAvatar): void {
    if (!this.isLastSelectedComputerAvatar(computerAvatar)) {
      computerAvatar.isSelected = !computerAvatar.isSelected;
      this.saveAndUpdateNumComputerAvatars();
    }
  }

  isLastSelectedComputerAvatar(computerAvatar: ComputerAvatar): boolean {
    return computerAvatar.isSelected && this.getNumSelectedComputerAvatars() === 1;
  }

  private saveAndUpdateNumComputerAvatars(): void {
    this.saveSelectedComputerAvatars();
    this.updateNumSelectedComputerAvatars();
  }

  private updateNumSelectedComputerAvatars(): void {
    this.numSelectedComputerAvatars = this.getNumSelectedComputerAvatars();
  }

  private getNumSelectedComputerAvatars(): number {
    return this.computerAvatarSettings.ids.length;
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
