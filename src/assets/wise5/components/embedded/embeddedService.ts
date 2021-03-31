'use strict';

import * as $ from 'jquery';
import * as html2canvas from 'html2canvas';
import { ComponentService } from '../componentService';
import { StudentAssetService } from '../../services/studentAssetService';
import { Injectable } from '@angular/core';
import { UtilService } from '../../services/utilService';
import { UpgradeModule } from '@angular/upgrade/static';
import { StudentDataService } from '../../services/studentDataService';
import { ConfigService } from '../../services/configService';
import { AnnotationService } from '../../services/annotationService';

@Injectable()
export class EmbeddedService extends ComponentService {
  defaultWidth: string = '100%';
  defaultHeight: string = '600px';
  iframePrefix: string = 'embedded-application-iframe-';

  constructor(
    private upgrade: UpgradeModule,
    protected AnnotationService: AnnotationService,
    protected ConfigService: ConfigService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
  }

  getEmbeddedApplicationIframeId(componentId: string): string {
    return `${this.iframePrefix}-${componentId}`;
  }

  getComponentTypeLabel() {
    return this.getTranslation('embedded.componentTypeLabel');
  }

  getTranslation(key: string) {
    return this.upgrade.$injector.get('$filter')('translate')(key);
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Embedded';
    component.url = '';
    component.height = 600;
    return component;
  }

  isCompleted(component: any, componentStates: any[], componentEvents: any[], nodeEvents: any[]) {
    if (componentStates != null) {
      if (
        this.hasComponentStateWithIsCompletedField(componentStates) &&
        this.hasComponentStateWithIsCompletedTrue(componentStates)
      ) {
        return true;
      }
    }
    return this.hasNodeEnteredEvent(nodeEvents);
  }

  hasComponentStateWithIsCompletedField(componentStates: any[]) {
    for (const componentState of componentStates) {
      const studentData = componentState.studentData;
      if (studentData != null && studentData.isCompleted != null) {
        return true;
      }
    }
    return false;
  }

  hasComponentStateWithIsCompletedTrue(componentStates: any[]) {
    for (const componentState of componentStates) {
      const studentData = componentState.studentData;
      if (studentData != null && studentData.isCompleted === true) {
        return true;
      }
    }
    return false;
  }

  hasNodeEnteredEvent(nodeEvents: any[]) {
    for (const nodeEvent of nodeEvents) {
      if (nodeEvent.event === 'nodeEntered') {
        return true;
      }
    }
    return false;
  }

  componentHasWork(component: any): boolean {
    return component.hasWork;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    return componentState.studentData != null;
  }

  /**
   * The component state has been rendered in a <component></component> element
   * and now we want to take a snapshot of the work.
   * @param componentState The component state that has been rendered.
   * @return A promise that will return an image object.
   */
  generateImageFromRenderedComponentState(componentState: any) {
    const modelElement = this.getModelElement(componentState.componentId);
    return new Promise((resolve, reject) => {
      html2canvas(modelElement).then((canvas) => {
        const base64Image = canvas.toDataURL('image/png');
        const imageObject = this.UtilService.getImageObjectFromBase64String(base64Image);
        this.StudentAssetService.uploadAsset(imageObject).then((asset) => {
          resolve(asset);
        });
      });
    });
  }

  getModelElement(componentId: string) {
    const iframeId = this.getEmbeddedApplicationIframeId(componentId);
    const iframe = $(`#${iframeId}`);
    if (iframe != null && iframe.length > 0) {
      const modelElement: any = iframe.contents().find('html');
      if (modelElement != null && modelElement.length > 0) {
        return modelElement[0];
      }
    }
    return null;
  }

  sendMessageToApplication(iframeId: string, message: any): void {
    (window.document.getElementById(iframeId) as HTMLIFrameElement).contentWindow.postMessage(
      message,
      '*'
    );
  }

  handleGetParametersMessage(
    iframeId: string,
    nodeId: string,
    componentId: string,
    componentContent: any
  ): void {
    let parameters: any = {};
    if (componentContent.parameters != null) {
      parameters = this.UtilService.makeCopyOfJSONObject(componentContent.parameters);
    }
    parameters.nodeId = nodeId;
    parameters.componentId = componentId;
    const message = {
      messageType: 'parameters',
      parameters: parameters
    };
    this.sendMessageToApplication(iframeId, message);
  }

  handleGetLatestAnnotationsMessage(iframeId: string, nodeId: string, componentId: string): void {
    const workgroupId = this.ConfigService.getWorkgroupId();
    const type = 'any';
    const latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId,
      type
    );
    const latestCommentAnnotation = this.AnnotationService.getLatestCommentAnnotation(
      nodeId,
      componentId,
      workgroupId,
      type
    );
    const message = {
      messageType: 'latestAnnotations',
      latestScoreAnnotation: latestScoreAnnotation,
      latestCommentAnnotation: latestCommentAnnotation
    };
    this.sendMessageToApplication(iframeId, message);
  }

  createLatestStudentWorkMessage(componentState: any): any {
    return {
      messageType: 'latestStudentWork',
      latestStudentWork: componentState
    };
  }

  createProjectPathMessage(): any {
    return {
      messageType: 'projectPath',
      projectPath: this.ConfigService.getConfigParam('projectBaseURL'),
      projectAssetsPath: this.ConfigService.getConfigParam('projectBaseURL') + 'assets'
    };
  }
}
