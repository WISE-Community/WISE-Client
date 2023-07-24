import { Component } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { AssetChooser } from '../project-asset-authoring/asset-chooser';

@Component({
  selector: 'project-info-authoring',
  templateUrl: './project-info-authoring.component.html',
  styleUrls: ['./project-info-authoring.component.scss']
})
export class ProjectInfoAuthoringComponent {
  isEditingProjectIcon: boolean = false;
  isShowProjectIcon: boolean = false;
  isShowProjectIconError: boolean = false;
  isShowProjectIconLoading: boolean = false;
  metadata: any;
  metadataAuthoring: any;
  metadataChanged: Subject<void> = new Subject<void>();
  projectIcon: string = '';
  projectIcons: any = [];

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.metadata = this.projectService.getProjectMetadata();
    this.metadataAuthoring = JSON.parse(
      this.configService.getConfigParam('projectMetadataSettings')
    );
    this.loadProjectIcon();
    this.processMetadata();
    this.metadataChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });
  }

  private processMetadata(): void {
    if (this.metadataAuthoring != null) {
      for (const field of this.metadataAuthoring.fields) {
        this.processMetadataAuthoringField(field);
      }
    }
  }

  private processMetadataAuthoringField(field: any): void {
    if (field?.type === 'checkbox') {
      this.processMetadataAuthoringFieldCheckbox(field);
    }
  }

  private processMetadataAuthoringFieldCheckbox(field: any): void {
    const metadataField = this.metadata[field.key];
    field.choicesMapping = {};
    if (metadataField != null && field.choices != null) {
      for (const choice of field.choices) {
        field.choicesMapping[choice] = this.hasUserCheckedThisMetadataField(metadataField, choice);
      }
    }
  }

  private hasUserCheckedThisMetadataField(metadataField: any, choice: string): boolean {
    let userHasCheckedThisMetadataField = false;
    for (const metadataFieldChoice of metadataField) {
      if (metadataFieldChoice != null && metadataFieldChoice == choice) {
        userHasCheckedThisMetadataField = true;
        break;
      }
    }
    return userHasCheckedThisMetadataField;
  }

  // returns the choice text that is appropriate for user's locale
  protected getMetadataChoiceText(choice: string): string {
    let choiceText = choice;
    const i18nMapping = this.metadataAuthoring.i18n;
    const i18nMappingContainingChoiceTextArray = Object.values(i18nMapping).filter(
      (onei18nMapping) => {
        return Object.values(onei18nMapping).indexOf(choice) != -1;
      }
    );
    if (
      i18nMappingContainingChoiceTextArray != null &&
      i18nMappingContainingChoiceTextArray.length > 0
    ) {
      // shouldn't be more than one, but if so, use the first one we find
      const i18nMappingContainingChoiceText = i18nMappingContainingChoiceTextArray[0];
      const userLocale = this.configService.getLocale();
      if (i18nMappingContainingChoiceText[userLocale] != null) {
        choiceText = i18nMappingContainingChoiceText[userLocale];
      }
    }
    return choiceText;
  }

  protected metadataChoiceIsChecked(metadataField: any, choice: string): boolean {
    return (
      this.getMetadataChoiceText(this.metadata[metadataField.key]) ==
      this.getMetadataChoiceText(choice)
    );
  }

  protected metadataCheckboxClicked(metadataField: any): void {
    const checkedChoices = [];
    for (const choice of metadataField.choices) {
      const isChoiceChecked = metadataField.choicesMapping[choice];
      if (isChoiceChecked) {
        checkedChoices.push(this.getMetadataChoiceText(choice));
      }
    }
    this.metadata[metadataField.key] = checkedChoices;
    this.save();
  }

  protected metadataRadioClicked(metadataField: any, choice: string): void {
    this.metadata[metadataField.key] = this.getMetadataChoiceText(choice);
    this.save();
  }

  private getFeaturedProjectIcons(): void {
    this.projectService.getFeaturedProjectIcons().then((featuredProjectIcons) => {
      this.projectIcons = featuredProjectIcons;
    });
  }

  protected setFeaturedProjectIcon(projectIcon: string): void {
    this.projectService.setFeaturedProjectIcon(projectIcon).then(() => {
      this.projectIcon = `projectIcons/${projectIcon}`;
      this.showProjectIcon();
      this.closeEditProjectIconMode();
    });
  }

  protected chooseCustomProjectIcon(): void {
    new AssetChooser(this.dialog)
      .open('projectIcon')
      .afterClosed()
      .subscribe((data: any) => {
        this.assetSelected(data);
      });
  }

  private assetSelected(args: any): void {
    if (args.target === 'projectIcon') {
      this.setCustomProjectIcon(args.assetItem.fileName);
    }
  }

  private setCustomProjectIcon(projectIcon: string): void {
    this.showProjectIconLoading();
    this.projectService.setCustomProjectIcon(projectIcon).then(() => {
      this.loadProjectIconAfterTimeout();
    });
  }

  /*
   * Load the project_thumb.png after a timeout to allow time for the image to be updated on the
   * server and browser. This is to prevent the browser from displaying the previous
   * project_thumb.png.
   */
  private loadProjectIconAfterTimeout(): void {
    setTimeout(() => {
      this.loadProjectIcon();
      this.closeEditProjectIconMode();
    }, 3000);
  }

  private loadProjectIcon(): void {
    this.projectIcon = `${this.configService.getConfigParam(
      'projectBaseURL'
    )}assets/project_thumb.png?timestamp=${new Date().getTime()}`;
    const image = new Image();
    image.onerror = () => {
      this.showProjectIconError();
    };
    image.onload = () => {
      this.showProjectIcon();
    };
    image.src = this.projectIcon;
  }

  protected toggleEditProjectIconMode(): void {
    this.isEditingProjectIcon = !this.isEditingProjectIcon;
    if (this.isEditingProjectIcon) {
      this.getFeaturedProjectIcons();
    }
  }

  private closeEditProjectIconMode(): void {
    this.isEditingProjectIcon = false;
  }

  private showProjectIcon(): void {
    this.isShowProjectIcon = true;
    this.isShowProjectIconError = false;
    this.isShowProjectIconLoading = false;
  }

  private showProjectIconError(): void {
    this.isShowProjectIcon = false;
    this.isShowProjectIconError = true;
    this.isShowProjectIconLoading = false;
  }

  private showProjectIconLoading(): void {
    this.isShowProjectIcon = false;
    this.isShowProjectIconError = false;
    this.isShowProjectIconLoading = true;
  }

  private save(): void {
    this.projectService.saveProject();
  }
}
