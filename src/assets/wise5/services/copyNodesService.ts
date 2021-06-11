import * as angular from 'angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';

@Injectable()
export class CopyNodesService {
  constructor(protected http: HttpClient, protected ConfigService: ConfigService) {}

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
