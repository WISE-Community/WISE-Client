import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarSettings } from '../../../common/computer-avatar/ComputerAvatarSettings';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'edit-dialog-guidance-computer-avatar',
  styleUrl: 'edit-dialog-guidance-computer-avatar.component.scss',
  templateUrl: './edit-dialog-guidance-computer-avatar.component.html',
  imports: [
    MatCheckbox,
    FormsModule,
    TranslatableInputComponent,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon
  ]
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
