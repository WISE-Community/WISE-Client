'use strict';

import * as angular from 'angular';
import { Component } from '@angular/core';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'draw-authoring',
  templateUrl: 'draw-authoring.component.html',
  styleUrls: ['draw-authoring.component.scss']
})
export class DrawAuthoring extends ComponentAuthoring {
  allToolNames: string[] = [
    'select',
    'line',
    'shape',
    'freeHand',
    'text',
    'stamp',
    'strokeColor',
    'fillColor',
    'clone',
    'strokeWidth',
    'sendBack',
    'sendForward',
    'undo',
    'redo',
    'delete'
  ];
  width: number;
  height: number;
  defaultWidth: number = 800;
  defaultHeight: number = 600;
  stamps: any[] = [];

  backgroundImageChange: Subject<string> = new Subject<string>();
  canvasWidthChange: Subject<string> = new Subject<string>();
  canvasHeightChange: Subject<string> = new Subject<string>();
  stampImageChange: Subject<string> = new Subject<string>();

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
    this.subscriptions.add(
      this.backgroundImageChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.updateStarterDrawDataBackgroundAndSave();
      })
    );
    this.subscriptions.add(
      this.canvasWidthChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.canvasWidthChanged();
      })
    );
    this.subscriptions.add(
      this.canvasHeightChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.canvasHeightChanged();
      })
    );
    this.subscriptions.add(
      this.stampImageChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.updateAuthoringComponentContentStampsAndSave();
      })
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.stamps = this.convertStampStringsToStampObjects(this.componentContent.stamps.Stamps);
  }

  enableAllTools(doEnable: boolean) {
    if (this.componentContent.tools == null) {
      this.componentContent.tools = {};
    }
    this.allToolNames.map((toolName) => {
      this.componentContent.tools[toolName] = doEnable;
    });
    this.componentChanged();
  }

  saveStarterState(starterState: any): void {
    this.componentContent.starterDrawData = starterState;
    this.componentChanged();
  }

  deleteStarterState(): void {
    this.componentContent.starterDrawData = null;
    this.componentChanged();
  }

  canvasWidthChanged(): void {
    this.width = this.componentContent.width;
    this.updateStarterDrawDataWidth();
    this.componentChanged();
  }

  updateStarterDrawDataWidth(): void {
    if (this.componentContent.starterDrawData != null) {
      const starterDrawDataJSONObject = angular.fromJson(this.componentContent.starterDrawData);
      if (starterDrawDataJSONObject != null && starterDrawDataJSONObject.dt != null) {
        if (this.width == null) {
          starterDrawDataJSONObject.dt.width = this.defaultWidth;
        } else {
          starterDrawDataJSONObject.dt.width = this.width;
        }
        this.componentContent.starterDrawData = angular.toJson(starterDrawDataJSONObject);
      }
    }
  }

  canvasHeightChanged(): void {
    this.height = this.componentContent.height;
    this.updateStarterDrawDataHeight();
    this.componentChanged();
  }

  updateStarterDrawDataHeight(): void {
    if (this.componentContent.starterDrawData != null) {
      const starterDrawDataJSONObject = angular.fromJson(this.componentContent.starterDrawData);
      if (starterDrawDataJSONObject != null && starterDrawDataJSONObject.dt != null) {
        if (this.height == null) {
          starterDrawDataJSONObject.dt.height = this.defaultHeight;
        } else {
          starterDrawDataJSONObject.dt.height = this.height;
        }
        this.componentContent.starterDrawData = angular.toJson(starterDrawDataJSONObject);
      }
    }
  }

  toolClicked(): void {
    this.componentChanged();
  }

  chooseStampImage(stampIndex: number): void {
    const params = {
      isPopup: true,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: 'stamp',
      targetObject: stampIndex
    };
    this.openAssetChooser(params);
  }

  assetSelected({ nodeId, componentId, assetItem, target, targetObject }): void {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    const fileName = assetItem.fileName;
    if (target === 'background') {
      this.componentContent.background = fileName;
      this.updateStarterDrawDataBackgroundAndSave();
    } else if (target === 'stamp') {
      const stampIndex = targetObject;
      this.setStampImage(stampIndex, fileName);
      this.updateAuthoringComponentContentStampsAndSave();
    }
  }

  updateStarterDrawDataBackgroundAndSave(): void {
    this.updateStarterDrawDataBackground();
    this.componentChanged();
  }

  updateStarterDrawDataBackground(): void {
    const starterDrawData = this.componentContent.starterDrawData;
    if (starterDrawData != null) {
      const starterDrawDataJSON = angular.fromJson(starterDrawData);
      if (
        starterDrawDataJSON != null &&
        starterDrawDataJSON.canvas != null &&
        starterDrawDataJSON.canvas.backgroundImage != null &&
        starterDrawDataJSON.canvas.backgroundImage.src != null
      ) {
        const projectAssetsDirectoryPath = this.ConfigService.getProjectAssetsDirectoryPath(true);
        const background = this.componentContent.background;
        const newSrc = projectAssetsDirectoryPath + '/' + background;
        starterDrawDataJSON.canvas.backgroundImage.src = newSrc;
        this.componentContent.starterDrawData = angular.toJson(starterDrawDataJSON);
      }
    }
  }

  addStamp(): void {
    this.initializeAuthoringComponentContentStampsIfNecessary();
    this.stamps.push(this.createStamp());
    this.updateAuthoringComponentContentStampsAndSave();
  }

  initializeAuthoringComponentContentStampsIfNecessary(): void {
    if (this.componentContent.stamps == null) {
      this.componentContent.stamps = {};
    }
    if (this.componentContent.stamps.Stamps == null) {
      this.componentContent.stamps.Stamps = [];
    }
  }

  createStamp(image: string = ''): any {
    return { image: image };
  }

  updateAuthoringComponentContentStampsAndSave(): void {
    this.updateAuthoringComponentContentStamps();
    this.componentChanged();
  }

  updateAuthoringComponentContentStamps(): void {
    this.componentContent.stamps.Stamps = this.convertStampObjectsToStampStrings(this.stamps);
  }

  moveStampUp(index: number): void {
    if (index != 0) {
      const stamp = this.stamps[index];
      this.stamps.splice(index, 1);
      this.stamps.splice(index - 1, 0, stamp);
      this.updateAuthoringComponentContentStampsAndSave();
    }
  }

  moveStampDown(index: number): void {
    if (index != this.componentContent.stamps.Stamps.length - 1) {
      const stamp = this.stamps[index];
      this.stamps.splice(index, 1);
      this.stamps.splice(index + 1, 0, stamp);
      this.updateAuthoringComponentContentStampsAndSave();
    }
  }

  deleteStamp(index: number): void {
    if (
      confirm(
        $localize`Are you sure you want to delete this stamp?\n\n${this.componentContent.stamps.Stamps[index]}`
      )
    ) {
      this.stamps.splice(index, 1);
      this.updateAuthoringComponentContentStampsAndSave();
    }
  }

  setStampImage(index: number, fileName: string): void {
    this.stamps[index].image = fileName;
  }

  stampChanged(stampImage: string, index: number): void {
    this.stampImageChange.next(`${index}-${stampImage}`);
  }

  convertStampStringsToStampObjects(stampStrings: string[]): any[] {
    const stampObjects: any[] = [];
    for (let stampString of stampStrings) {
      stampObjects.push(this.createStamp(stampString));
    }
    return stampObjects;
  }

  convertStampObjectsToStampStrings(stampObjects: any[]): string[] {
    const stampStrings: string[] = [];
    for (let stampObject of stampObjects) {
      stampStrings.push(stampObject.image);
    }
    return stampStrings;
  }
}
