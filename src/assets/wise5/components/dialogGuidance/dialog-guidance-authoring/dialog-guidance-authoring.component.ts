import { Component } from '@angular/core';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ComputerAvatar } from '../../../common/ComputerAvatar';

@Component({
  selector: 'app-dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html',
  styleUrls: ['./dialog-guidance-authoring.component.scss']
})
export class DialogGuidanceAuthoringComponent extends ComponentAuthoring {
  allComputerAvatars: any;
  avatarsPath: string;
  inputChange: Subject<string> = new Subject<string>();
  numSelectedComputerAvatars: number;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    protected configService: ConfigService,
    protected nodeService: NodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
    this.subscriptions.add(
      this.inputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.allComputerAvatars = this.computerAvatarService.getAvatars();
    this.avatarsPath = this.computerAvatarService.getAvatarsPath();
    if (this.authoringComponentContent.isComputerAvatarEnabled) {
      this.tryInitializeComputerAvatarIds();
      this.populateAndUpdateNumSelectedComputerAvatars();
    }
  }

  enableComputerAvatarClicked(): void {
    if (this.authoringComponentContent.isComputerAvatarEnabled) {
      if (this.authoringComponentContent.computerAvatarIds == null) {
        this.tryInitializeComputerAvatarIds();
        this.selectAllComputerAvatars();
      }
      this.populateAndUpdateNumSelectedComputerAvatars();
    } else {
      this.componentChanged();
    }
  }

  populateAndUpdateNumSelectedComputerAvatars(): void {
    this.populateSelectedComputerAvatars();
    this.updateNumSelectedComputerAvatars();
    this.componentChanged();
  }

  updateNumSelectedComputerAvatars(): void {
    this.numSelectedComputerAvatars = this.getNumSelectedComputerAvatars();
  }

  populateSelectedComputerAvatars(): void {
    for (const availableComputerAvatar of this.allComputerAvatars) {
      if (this.authoringComponentContent.computerAvatarIds[availableComputerAvatar.id]) {
        availableComputerAvatar.isSelected = true;
      }
    }
  }

  getNumSelectedComputerAvatars(): number {
    return Object.keys(this.authoringComponentContent.computerAvatarIds).length;
  }

  tryInitializeComputerAvatarIds(): void {
    if (this.authoringComponentContent.computerAvatarIds == null) {
      this.authoringComponentContent.computerAvatarIds = {};
    }
  }

  selectAllComputerAvatars(): void {
    for (const availableComputerAvatar of this.allComputerAvatars) {
      availableComputerAvatar.isSelected = true;
    }
    this.saveAndUpdateNumComputerAvatars();
  }

  unselectAllComputerAvatars(): void {
    for (const availableComputerAvatar of this.allComputerAvatars) {
      availableComputerAvatar.isSelected = false;
    }
    this.saveAndUpdateNumComputerAvatars();
  }

  toggleSelectComputerAvatar(computerAvatar: ComputerAvatar): void {
    computerAvatar.isSelected = !computerAvatar.isSelected;
    this.saveAndUpdateNumComputerAvatars();
  }

  saveAndUpdateNumComputerAvatars(): void {
    this.saveSelectedComputerAvatars();
    this.updateNumSelectedComputerAvatars();
  }

  saveSelectedComputerAvatars(): void {
    this.authoringComponentContent.computerAvatars = {};
    for (const availableComputerAvatar of this.allComputerAvatars) {
      if (availableComputerAvatar.isSelected) {
        this.authoringComponentContent.computerAvatarIds[availableComputerAvatar.id] = true;
      } else {
        delete this.authoringComponentContent.computerAvatarIds[availableComputerAvatar.id];
      }
    }
    this.componentChanged();
  }
}
