'use strict';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RandomKeyService } from '../services/randomKeyService';
import { ComponentStateRequest } from './ComponentStateRequest';
import { ComponentStateWrapper } from './ComponentStateWrapper';

@Injectable()
export class ComponentService {
  private requestComponentStateSource = new Subject<ComponentStateRequest>();
  public requestComponentStateSource$ = this.requestComponentStateSource.asObservable();
  private sendComponentStateSource = new Subject<ComponentStateWrapper>();
  public sendComponentStateSource$ = this.sendComponentStateSource.asObservable();
  private notifyConnectedComponentSource = new Subject<any>();
  public notifyConnectedComponentSource$ = this.notifyConnectedComponentSource.asObservable();

  constructor() {}

  getDomIdEnding(nodeId: string, componentId: string, componentState: any): string {
    if (componentState == null) {
      return `${nodeId}-${componentId}`;
    } else {
      return `${nodeId}-${componentId}-${componentState.id}`;
    }
  }

  getElementId(domIdBeginning: string, domIdEnding: string): string {
    return `${domIdBeginning}-${domIdEnding}`;
  }

  requestComponentState(nodeId: string, componentId: string, isSubmit: boolean = false): void {
    this.requestComponentStateSource.next({
      nodeId: nodeId,
      componentId: componentId,
      isSubmit: isSubmit
    });
  }

  sendComponentState(componentStateWrapper: ComponentStateWrapper): void {
    this.sendComponentStateSource.next(componentStateWrapper);
  }

  notifyConnectedComponentSubscribers(
    nodeId: string,
    componentId: string,
    componentState: any
  ): void {
    this.notifyConnectedComponentSource.next({
      nodeId: nodeId,
      componentId: componentId,
      componentState: componentState
    });
  }

  /**
   * Get the component type label. For example "Open Response".
   * @returns {string}
   */
  getComponentTypeLabel(): string {
    return '';
  }

  /**
   * Create a component object
   * @returns {object} a component object
   */
  createComponent() {
    return {
      id: RandomKeyService.generate(),
      type: '',
      prompt: '',
      showSaveButton: false,
      showSubmitButton: false
    };
  }

  /**
   * Check if the component was completed
   * @param component the component object
   * @param componentStates the component states for the specific component
   * @param nodeEvents the events for the parent node of the component
   * @param node parent node of the component
   * @returns {boolean} whether the component was completed
   */
  isCompleted(component, componentStates, nodeEvents, node) {
    return true;
  }

  /**
   * Check if we need to display the annotation to the student
   * @param componentContent the component content
   * @param annotation the annotation
   * @returns {boolean} whether we need to display the annotation to the student
   */
  displayAnnotation(componentContent, annotation) {
    return true;
  }

  /**
   * Whether this component generates student work
   * @param component (optional) the component object. if the component object
   * is not provided, we will use the default value of whether the
   * component type usually has work.
   * @return {boolean} whether this component generates student work
   */
  componentHasWork(component) {
    return true;
  }

  /**
   * Check if the component state has student work. Sometimes a component
   * state may be created if the student visits a component but doesn't
   * actually perform any work. This is where we will check if the student
   * actually performed any work.
   * @param componentState the component state object
   * @param componentContent the component content
   * @return {boolean} whether the component state has any work
   */
  componentStateHasStudentWork(componentState, componentContent) {
    return false;
  }

  /**
   * Get the human readable student data string
   * @param componentState the component state
   * @return {string} a human readable student data string
   */
  getStudentDataString(componentState) {
    return '';
  }

  /**
   * Whether this component uses a save button
   * @return {boolean} whether this component uses a save button
   */
  componentUsesSaveButton() {
    return true;
  }

  /**
   * Whether this component uses a submit button
   * @return {boolean} whether this component uses a submit button
   */
  componentUsesSubmitButton() {
    return true;
  }

  componentHasCorrectAnswer(component) {
    return false;
  }

  isSubmitRequired(node: any, component: any) {
    return node.showSubmitButton || (component.showSubmitButton && !node.showSaveButton);
  }
}
