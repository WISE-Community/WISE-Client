'use strict';

import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { generateRandomKey } from '../../../common/string/string';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'animation-authoring',
  templateUrl: 'animation-authoring.component.html',
  styleUrls: ['animation-authoring.component.scss']
})
export class AnimationAuthoring extends AbstractComponentAuthoring {
  stepNodesDetails: string[];
  availableDataSourceComponentTypes = ['Graph'];
  inputChange: Subject<string> = new Subject<string>();
  inputChangeSubscription: Subscription;

  constructor(
    protected ConfigService: ConfigService,
    private dialog: MatDialog,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
    this.stepNodesDetails = this.ProjectService.getStepNodesDetailsInOrder();
    this.inputChangeSubscription = this.inputChange
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.componentChanged();
      });
  }

  addObject(): void {
    if (this.componentContent.objects == null) {
      this.componentContent.objects = [];
    }
    const newObject = {
      id: generateRandomKey(),
      type: 'image'
    };
    this.componentContent.objects.push(newObject);
    this.componentChanged();
  }

  addDataPointToObject(authoredObject: any): void {
    if (this.authoredObjectHasDataSource(authoredObject)) {
      if (this.askIfWantToDeleteDataSource()) {
        delete authoredObject.dataSource;
        this.addNewDataPoint(authoredObject);
      }
    } else {
      this.addNewDataPoint(authoredObject);
    }
    this.componentChanged();
  }

  authoredObjectHasDataSource(authoredObject: any): boolean {
    return authoredObject.dataSource != null;
  }

  askIfWantToDeleteDataSource(): boolean {
    return confirm(
      $localize`You can only have Data Points or a Data Source. If you add a Data Point, the Data Source will be deleted. Are you sure you want to add a Data Point?`
    );
  }

  initializeAuthoredObjectDataIfNecessary(authoredObject: any): void {
    if (authoredObject.data == null) {
      authoredObject.data = [];
    }
  }

  addNewDataPoint(authoredObject: any): void {
    this.initializeAuthoredObjectDataIfNecessary(authoredObject);
    const newDataPoint = {};
    authoredObject.data.push(newDataPoint);
  }

  confirmDeleteAnimationObjectDataPoint(animationObject: any, index: number): void {
    if (confirm($localize`Are you sure you want to delete this data point?`)) {
      this.deleteAnimationObjectDataPoint(animationObject, index);
    }
  }

  deleteAnimationObjectDataPoint(animationObject: any, index: number): void {
    animationObject.data.splice(index, 1);
    this.componentChanged();
  }

  moveAuthoredObjectDataPointUp(object: any, index: number): void {
    if (this.canMoveUp(index)) {
      const dataPoint = object.data[index];
      object.data.splice(index, 1);
      object.data.splice(index - 1, 0, dataPoint);
      this.componentChanged();
    }
  }

  moveAuthoredObjectDataPointDown(object: any, index: number): void {
    if (this.canMoveDown(index, object.data.length)) {
      const dataPoint = object.data[index];
      object.data.splice(index, 1);
      object.data.splice(index + 1, 0, dataPoint);
      this.componentChanged();
    }
  }

  moveAuthoredObjectUp(index: number): void {
    if (this.canMoveUp(index)) {
      const objects = this.componentContent.objects;
      const object = objects[index];
      objects.splice(index, 1);
      objects.splice(index - 1, 0, object);
      this.componentChanged();
    }
  }

  moveAuthoredObjectDown(index: number): void {
    const objects = this.componentContent.objects;
    if (this.canMoveDown(index, objects.length)) {
      const object = objects[index];
      objects.splice(index, 1);
      objects.splice(index + 1, 0, object);
      this.componentChanged();
    }
  }

  canMoveUp(index: number): boolean {
    return index > 0;
  }

  canMoveDown(index: number, length: number): boolean {
    return index < length - 1;
  }

  confirmDeleteAnimationObject(index: number): void {
    if (confirm($localize`Are you sure you want to delete this object?`)) {
      this.deleteAnimationObject(index);
    }
  }

  deleteAnimationObject(index: number): void {
    this.componentContent.objects.splice(index, 1);
    this.componentChanged();
  }

  addDataSource(authoredObject: any): void {
    if (this.authoredObjectHasData(authoredObject)) {
      if (
        confirm(
          $localize`You can only have Data Points or a Data Source. If you add a Data Source, the Data Points will be deleted. Are you sure you want to add a Data Source?`
        )
      ) {
        this.deleteDataAndAddDataSource(authoredObject);
      }
    } else {
      this.deleteDataAndAddDataSource(authoredObject);
    }
    this.componentChanged();
  }

  authoredObjectHasData(authoredObject: any): boolean {
    return authoredObject.data != null && authoredObject.data.length > 0;
  }

  deleteDataAndAddDataSource(authoredObject: any): void {
    this.deleteDataFromAuthoredObject(authoredObject);
    this.addDataSourceToAuthoredObject(authoredObject);
  }

  deleteDataFromAuthoredObject(authoredObject: any): void {
    delete authoredObject.data;
  }

  addDataSourceToAuthoredObject(authoredObject: any): void {
    authoredObject.dataSource = {};
  }

  confirmDeleteDataSource(animationObject: any): void {
    if (confirm($localize`Are you sure you want to delete the Data Source?`)) {
      this.deleteDataSource(animationObject);
    }
  }

  deleteDataSource(animationObject: any): void {
    delete animationObject.dataSource;
    this.componentChanged();
  }

  dataSourceNodeChanged(authoredObject: any): void {
    const nodeId = authoredObject.dataSource.nodeId;
    authoredObject.dataSource = {
      nodeId: nodeId
    };
    const components = this.getComponents(nodeId);
    const availableDataSourceComponents = components.filter((component) => {
      return this.availableDataSourceComponentTypes.includes(component.type);
    });
    if (availableDataSourceComponents.length === 1) {
      authoredObject.dataSource.componentId = availableDataSourceComponents[0].id;
      this.dataSourceComponentChanged(authoredObject);
    } else {
      this.componentChanged();
    }
  }

  dataSourceComponentChanged(authoredObject: any): void {
    const nodeId = authoredObject.dataSource.nodeId;
    const componentId = authoredObject.dataSource.componentId;
    const component = this.getComponent(nodeId, componentId);
    authoredObject.dataSource = {
      nodeId: nodeId,
      componentId: componentId
    };
    if (this.isAvailableDataSourceComponentType(component.type)) {
      this.setDefaultParamsForGraphDataSource(authoredObject);
    }
    this.componentChanged();
  }

  isAvailableDataSourceComponentType(componentType: string) {
    return this.availableDataSourceComponentTypes.includes(componentType);
  }

  setDefaultParamsForGraphDataSource(authoredObject: any): void {
    authoredObject.dataSource.trialIndex = 0;
    authoredObject.dataSource.seriesIndex = 0;
    authoredObject.dataSource.tColumnIndex = 0;
    authoredObject.dataSource.xColumnIndex = 1;
  }

  chooseImage(authoredObject: any, targetString: string = 'image'): void {
    new AssetChooser(this.dialog, this.nodeId, this.componentId)
      .open(targetString, authoredObject)
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((data: any) => {
        return this.assetSelected(data);
      });
  }

  /**
   * @param {string} targetString Can be 'image', 'imageMovingLeft', or 'imageMovingRight'.
   * @param {object} authoredObject
   * @returns {object}
   */
  createOpenAssetChooserParamsObject(targetString: string, authoredObject: any): any {
    return {
      isPopup: true,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: targetString,
      targetObject: authoredObject
    };
  }

  assetSelected({ nodeId, componentId, assetItem, target, targetObject }): void {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    targetObject[target] = assetItem.fileName;
    this.componentChanged();
  }

  authoredObjectTypeChanged(authoredObject: any): void {
    if (authoredObject.type === 'image') {
      this.removeTextFromAuthoredObject(authoredObject);
    } else if (authoredObject.type === 'text') {
      this.removeImageFromAuthoredObject(authoredObject);
    }
    this.componentChanged();
  }

  removeTextFromAuthoredObject(authoredObject: any): void {
    delete authoredObject.text;
  }

  removeImageFromAuthoredObject(authoredObject: any): void {
    [
      'image',
      'width',
      'height',
      'imageMovingLeft',
      'imageMovingRight',
      'imageMovingUp',
      'imageMovingDown'
    ].forEach((field) => {
      delete authoredObject[field];
    });
  }

  getComponent(nodeId: string, componentId: string): any {
    if (nodeId != null && componentId != null) {
      const component = super.getComponent(nodeId, componentId);
      if (component != null) {
        return component;
      }
    }
    return {};
  }
}
