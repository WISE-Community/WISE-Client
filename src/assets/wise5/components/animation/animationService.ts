'use strict';

import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';

@Injectable()
export class AnimationService extends ComponentService {
  getComponentTypeLabel(): string {
    return $localize`Animation`;
  }

  getSvgId(domIdEnding: string): string {
    return `svg-${domIdEnding}`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Animation';
    component.widthInPixels = 600;
    component.widthInUnits = 60;
    component.heightInPixels = 200;
    component.heightInUnits = 20;
    component.dataXOriginInPixels = 0;
    component.dataYOriginInPixels = 80;
    component.coordinateSystem = 'screen';
    component.objects = [];
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    return componentStates.length > 0;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    if (componentState != null) {
      return componentState.studentData != null;
    }
    return false;
  }
}
