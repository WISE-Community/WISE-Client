import { Component, Inject, Optional } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { isImage, isVideo } from '../../common/file/file';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssetChooserDialogData } from './asset-chooser-dialog-data';

@Component({
  selector: 'project-asset-authoring',
  templateUrl: './project-asset-authoring.component.html',
  styleUrls: ['./project-asset-authoring.component.scss']
})
export class ProjectAssetAuthoringComponent {
  allowedFileTypes: string[] = ['any'];
  assetIsImage: boolean;
  assetIsVideo: boolean;
  assetSortBy = 'aToZ';
  componentId = null;
  errorFiles: any;
  isPopup = false;
  nodeId = null;
  previewAssetURL: string;
  projectAssets: any;
  projectAssetTotalSizeMax = 0;
  projectAssetUsagePercentage: any = 0;
  selectedAssetItem: any;
  subscriptions: Subscription = new Subscription();
  successFiles: any;
  target = null;
  targetObject = null;
  totalFileSize = 0;
  totalUnusedFilesSize = 0;
  unusedFilesPercentage = 0;
  uploadSuccessMessage = '';
  uploadErrorMessage: any;

  constructor(
    private configService: ConfigService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: AssetChooserDialogData,
    @Optional() protected dialogRef: MatDialogRef<ProjectAssetAuthoringComponent>,
    private projectAssetService: ProjectAssetService
  ) {}

  ngOnInit(): void {
    if (this.dialogData != null) {
      this.setParams(this.dialogData);
    }

    this.subscriptions.add(
      this.projectAssetService.getProjectAssets().subscribe((projectAssets) => {
        if (projectAssets != null) {
          this.projectAssets = projectAssets;
          this.sortAssets(this.assetSortBy);
          this.projectAssetTotalSizeMax = this.projectAssetService.totalSizeMax;
        }
      })
    );

    this.subscriptions.add(
      this.projectAssetService.getTotalFileSize().subscribe((totalFileSize) => {
        this.setTotalFileSize(totalFileSize);
      })
    );

    this.subscriptions.add(
      this.projectAssetService.getTotalUnusedFileSize().subscribe((totalUnusedFilesSize) => {
        this.setTotalUnusedFilesSize(totalUnusedFilesSize);
      })
    );

    if (this.projectAssetService.isProjectAssetsAvailable()) {
      this.projectAssetService.calculateAssetUsage();
    }
  }

  private setParams(params: any): void {
    if (params.isPopup != null) {
      this.isPopup = true;
    }
    if (params.nodeId != null) {
      this.nodeId = params.nodeId;
    }
    if (params.componentId != null) {
      this.componentId = params.componentId;
    }
    if (params.target != null) {
      this.target = params.target;
    }
    if (params.targetObject != null) {
      this.targetObject = params.targetObject;
    }
    if (params.allowedFileTypes != null) {
      this.allowedFileTypes = params.allowedFileTypes;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected assetSortByChanged(): void {
    this.sortAssets(this.assetSortBy);
  }

  private sortAssets(sortBy: string): void {
    if (sortBy === 'aToZ') {
      this.projectAssets.files.sort(this.sortAssetsAToZ);
    } else if (sortBy === 'zToA') {
      this.projectAssets.files = this.projectAssets.files.sort(this.sortAssetsAToZ).reverse();
    } else if (sortBy === 'smallToLarge') {
      this.projectAssets.files.sort(this.sortAssetsSmallToLarge);
    } else if (sortBy === 'largeToSmall') {
      this.projectAssets.files = this.projectAssets.files
        .sort(this.sortAssetsSmallToLarge)
        .reverse();
    }
  }

  private sortAssetsAToZ(a: any, b: any): number {
    return a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase());
  }

  private sortAssetsSmallToLarge(a: any, b: any): number {
    return a.fileSize - b.fileSize;
  }

  protected deleteAsset(assetItem: any): void {
    if (confirm($localize`Are you sure you want to delete this file?\n\n${assetItem.fileName}`)) {
      this.projectAssetService.deleteAssetItem(assetItem);
    }
  }

  protected downloadAsset(assetItem: any): void {
    this.projectAssetService.downloadAssetItem(assetItem);
  }

  protected chooseAsset(assetItem: any): void {
    const params = {
      assetItem: assetItem,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: this.target,
      targetObject: this.targetObject
    };
    this.dialogRef.close(params);
  }

  protected uploadAssetItems(files: any[]): void {
    let performUploadOfAllFiles = true;
    const largeAndSmallFiles = this.separateLargeAndSmallFiles(files);
    const largeFiles = largeAndSmallFiles.largeFiles;
    const smallFiles = largeAndSmallFiles.smallFiles;
    if (largeFiles.length > 0) {
      performUploadOfAllFiles = confirm(this.getLargeFileMessage(files, largeFiles));
    }
    if (performUploadOfAllFiles) {
      this.uploadAssets(files);
    } else if (smallFiles.length > 0) {
      this.uploadAssets(smallFiles);
    }
  }

  private separateLargeAndSmallFiles(files: any[]): any {
    const largeFiles = [];
    const smallFiles = [];
    for (const file of files) {
      if (this.isFileLarge(file)) {
        largeFiles.push(file);
      } else {
        smallFiles.push(file);
      }
    }
    return { largeFiles: largeFiles, smallFiles: smallFiles };
  }

  private isFileLarge(file: any): boolean {
    return file.size > 500000;
  }

  /**
   * Get the confirm message to display to the author because they are trying to upload at least one
   * large file.
   * @param files All the files they are trying to upload.
   * @param largeFiles All the large files they are trying to upload.
   * @returns {string} The message to show to the author.
   */
  private getLargeFileMessage(files: any[], largeFiles: any[]): string {
    let message = ``;
    if (files.length == 1 && largeFiles.length == 1) {
      message = $localize`The file you are trying to upload is larger than 500 KB. We recommend using smaller files so they load faster for students. Are you sure you want to upload this large file?\n`;
    } else if (largeFiles.length == 1) {
      message = $localize`One of the files you are trying to upload is larger than 500 KB. We recommend using smaller files so they load faster for students. Are you sure you want to upload the large file?\n`;
    } else if (largeFiles.length > 1) {
      message = $localize`${largeFiles.length} of the files you are trying to upload are larger than 500 KB. We recommend using smaller files so they load faster for students. Are you sure you want to upload these large files?\n`;
    }
    for (const largeFile of largeFiles) {
      message += `\n${largeFile.name} (${Math.floor(largeFile.size / 1000)} KB)`;
    }
    return message;
  }

  private uploadAssets(files: any[]): void {
    this.subscriptions.add(
      this.projectAssetService
        .uploadAssets(files)
        .subscribe(({ success, error, assetDirectoryInfo }) => {
          if (success.length > 0) {
            this.showUploadedFiles(success);
          }
          if (error.length > 0) {
            this.showError(error);
          }
          this.projectAssets = assetDirectoryInfo;
          if (this.hasTarget()) {
            this.chooseAsset({ fileName: files[0].name, fileSize: files[0].size });
          }
        })
    );
  }

  private showUploadedFiles(uploadedFiles: any[]): void {
    this.successFiles = uploadedFiles;
    this.uploadSuccessMessage = $localize`Successfully uploaded:`;
    setTimeout(() => {
      this.uploadSuccessMessage = '';
      this.successFiles = [];
    }, 7000);
  }

  private showError(error: any): void {
    this.errorFiles = error;
    this.uploadErrorMessage = $localize`Error uploading: `;
    setTimeout(() => {
      this.uploadErrorMessage = '';
      this.errorFiles = [];
    }, 7000);
  }

  private hasTarget(): boolean {
    return (
      (this.nodeId != null && this.componentId != null && this.target != null) ||
      this.target === 'projectIcon'
    );
  }

  protected previewAsset(assetItem: any): void {
    this.selectedAssetItem = assetItem;
    const assetFileName = assetItem.fileName;
    const assetsDirectoryPath = this.configService.getProjectAssetsDirectoryPath();
    this.previewAssetURL = `${assetsDirectoryPath}/${assetFileName}`;
    this.assetIsImage = false;
    this.assetIsVideo = false;
    if (isImage(assetFileName)) {
      this.assetIsImage = true;
    } else if (isVideo(assetFileName)) {
      this.assetIsVideo = true;
      $('video').load(this.previewAssetURL);
    }
  }

  private setTotalFileSize(totalFileSize: number): void {
    this.totalFileSize = totalFileSize;
    this.projectAssetUsagePercentage = this.projectAssetService.getAssetUsagePercentage();
  }

  private setTotalUnusedFilesSize(totalUnusedFilesSize: number): void {
    this.totalUnusedFilesSize = totalUnusedFilesSize;
    this.unusedFilesPercentage = this.projectAssetService.getAssetUnusedPercentage();
  }

  protected fileChosen(event: any): void {
    const files = Array.from(event);
    this.uploadAssetItems(files);
  }
}
