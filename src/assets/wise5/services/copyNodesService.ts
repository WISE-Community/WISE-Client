import * as angular from 'angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { UtilService } from './utilService';

@Injectable()
export class CopyNodesService {
  constructor(
    protected http: HttpClient,
    protected ConfigService: ConfigService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {}

  /**
   * Copy node and put it inside a specified group as first step
   * @param nodeId the node id to copy
   * @param groupId the group to insert the copied node as first step
   */
  copyNodeInside(nodeId: string, groupId: string): any {
    const newNode = this.copyNode(nodeId);
    this.ProjectService.createNodeInside(newNode, groupId);
    this.ProjectService.parseProject();
    return newNode;
  }

  /**
   * Copy nodes and put them after a certain node id
   * @param nodeIds the node ids to copy
   * @param nodeIdAfter the node id we will put the copied nodes after
   */
  copyNodesAfter(nodeIds: string[], nodeIdAfter: string): any[] {
    const newNodes = [];
    for (const nodeId of nodeIds) {
      const newNode = this.copyNode(nodeId);
      this.ProjectService.createNodeAfter(newNode, nodeIdAfter);
      nodeIdAfter = newNode.id;
      this.ProjectService.parseProject();
      newNodes.push(newNode);
    }
    return newNodes;
  }

  /**
   * Copy the node with the specified nodeId
   * @param nodeId the node id to copy
   * @return copied node
   */
  private copyNode(nodeId: string): any {
    const node = this.ProjectService.getNodeById(nodeId);
    const nodeCopy = this.UtilService.makeCopyOfJSONObject(node);
    nodeCopy.id = this.ProjectService.getNextAvailableNodeId();
    nodeCopy.transitionLogic = {};
    nodeCopy.constraints = [];

    const newComponentIds = [];
    for (const component of nodeCopy.components) {
      const newComponentId = this.ProjectService.getUnusedComponentId(newComponentIds);
      newComponentIds.push(newComponentId);
      component.id = newComponentId;
    }
    return nodeCopy;
  }

  /**
   * Get a copy of nodes from the fromProject. This will copy the asset files
   * and change file names if necessary. If an asset file with the same
   * name exists in both projects we will check if their content is the
   * same. If the content is the same we don't need to copy the file. If
   * the content is different, we need to make a copy of the file with a
   * new name and change all the references in the steps to use the new
   * name.
   * @param nodes the nodes to import
   * @param fromProjectId copy the nodes from this project
   * @param toProjectId copy the nodes into this project
   * @returns an observable with an array of copied nodes
   */
  copyNodes(nodes: any[], fromProjectId: number, toProjectId: number) {
    return this.http.post(this.ConfigService.getConfigParam('importStepsURL'), {
      steps: angular.toJson(nodes),
      fromProjectId: fromProjectId,
      toProjectId: toProjectId
    });
  }
}
