import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ComputerAvatar } from '../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComputerAvatarSettings } from '../../common/computer-avatar/ComputerAvatarSettings';

@Component({
  imports: [FormsModule, MatButtonModule, MatCardModule, MatDividerModule],
  selector: 'computer-avatar-selector',
  styleUrl: './computer-avatar-selector.component.scss',
  templateUrl: './computer-avatar-selector.component.html'
})
export class ComputerAvatarSelectorComponent implements OnInit {
  protected avatars: ComputerAvatar[];
  protected avatarsPath: string;
  @Output() chooseAvatarEvent = new EventEmitter<ComputerAvatar>();
  @Input() computerAvatarSettings: ComputerAvatarSettings;
  protected label: string;
  protected selectedAvatar: ComputerAvatar;

  constructor(private computerAvatarService: ComputerAvatarService) {}

  ngOnInit(): void {
    this.initializeLabel();
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    this.avatars = this.computerAvatarService
      .getAvatars()
      .filter((avatar) => this.computerAvatarSettings.ids.includes(avatar.id));
    if (this.avatars.length === 1) {
      this.selectedAvatar = this.avatars[0];
    }
  }

  private initializeLabel(): void {
    const computerAvatarSettingsLabel = this.computerAvatarSettings.label;
    this.label =
      computerAvatarSettingsLabel == null || computerAvatarSettingsLabel === ''
        ? this.computerAvatarService.getDefaultComputerAvatarLabel()
        : computerAvatarSettingsLabel;
  }
}
