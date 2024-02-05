import { ComputerAvatar } from './ComputerAvatar';
import { ComputerAvatarComponent } from './computer-avatar-component';
import { ComputerAvatarService } from '../services/computerAvatarService';
import { StudentStatusService } from '../services/studentStatusService';

export abstract class ComputerAvatarMixin {
  component: ComputerAvatarComponent;
  componentState: any;
  protected computerAvatar: ComputerAvatar;
  protected computerAvatarSelectorVisible: boolean = false;

  constructor(
    protected computerAvatarService: ComputerAvatarService,
    protected studentStatusService: StudentStatusService
  ) {}

  protected initializeComputerAvatar(): void {
    if (this.component.isComputerAvatarEnabled()) {
      this.tryToRepopulateComputerAvatar();
      if (this.hasStudentPreviouslyChosenComputerAvatar()) {
        this.hideComputerAvatarSelector();
      } else if (
        this.component.isOnlyOneComputerAvatarAvailable() &&
        !this.component.isComputerAvatarPromptAvailable()
      ) {
        this.selectComputerAvatar(this.getFirstComputerAvatar());
      } else {
        this.showComputerAvatarSelector();
      }
    } else {
      this.computerAvatar = this.computerAvatarService.getDefaultAvatar();
    }
  }

  private tryToRepopulateComputerAvatar(): void {
    if (this.includesComputerAvatar(this.componentState)) {
      this.repopulateComputerAvatarFromComponentState(this.componentState);
    } else if (
      this.component.isUseGlobalComputerAvatar() &&
      this.studentStatusService.isGlobalComputerAvatarAvailable()
    ) {
      this.repopulateGlobalComputerAvatar();
    }
  }

  private includesComputerAvatar(componentState: any): boolean {
    return componentState?.studentData?.computerAvatarId != null;
  }

  private repopulateComputerAvatarFromComponentState(componentState: any): void {
    this.computerAvatar = this.computerAvatarService.getAvatar(
      componentState?.studentData?.computerAvatarId
    );
  }

  private repopulateGlobalComputerAvatar(): void {
    const computerAvatarId = this.studentStatusService.getComputerAvatarId();
    if (computerAvatarId != null) {
      this.selectComputerAvatar(this.computerAvatarService.getAvatar(computerAvatarId));
    }
  }

  private hasStudentPreviouslyChosenComputerAvatar(): boolean {
    return this.computerAvatar != null;
  }

  private getFirstComputerAvatar(): ComputerAvatar {
    return this.computerAvatarService.getAvatar(
      this.component.content.computerAvatarSettings.ids[0]
    );
  }

  private showComputerAvatarSelector(): void {
    this.computerAvatarSelectorVisible = true;
  }

  private hideComputerAvatarSelector(): void {
    this.computerAvatarSelectorVisible = false;
  }

  protected selectComputerAvatar(computerAvatar: ComputerAvatar): void {
    this.computerAvatar = computerAvatar;
    if (this.component.isUseGlobalComputerAvatar()) {
      this.studentStatusService.setComputerAvatarId(computerAvatar.id);
    }
    this.hideComputerAvatarSelector();
    const computerAvatarInitialResponse = this.component.getComputerAvatarInitialResponse();
    if (computerAvatarInitialResponse != null && computerAvatarInitialResponse !== '') {
      this.showInitialMessage();
    }
  }

  abstract showInitialMessage(): void;
}
