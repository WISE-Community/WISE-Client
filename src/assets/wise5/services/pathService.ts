import { Injectable } from '@angular/core';

@Injectable()
export class PathService {
  /**
   * Check if all the paths are empty
   * @param paths an array of paths. each path is an array of node ids
   * @return true iff all the paths are empty
   */
  arePathsEmpty(paths: string[][]): boolean {
    return paths.every((path) => path.length === 0);
  }

  /**
   * Get the path at the given index and get the first node id in
   * the path
   * @param paths an array of paths. each path is an array of node ids
   * @param index the index of the path we want
   * @return the first node in the given path
   */
  getFirstNodeIdInPathAtIndex(paths: string[][], index: number): string {
    let nodeId = null;
    if (paths != null && index != null) {
      const path = paths[index];
      if (path != null && path.length > 0) {
        nodeId = path[0];
      }
    }
    return nodeId;
  }

  /**
   * Check if the first node ids in the paths are the same
   * @param paths an array of paths. each path is an array of node ids
   * @return whether all the paths have the same first node id
   */
  areFirstNodeIdsInPathsTheSame(paths: string[][]): boolean {
    let result = true;
    let nodeId = null;
    if (paths != null) {
      for (let path of paths) {
        const tempNodeId = path[0];
        if (nodeId == null) {
          /*
           * this is the first path we have looked at so we will
           * remember the node id
           */
          nodeId = tempNodeId;
        } else if (nodeId != tempNodeId) {
          /*
           * the node id does not match the first node id from a
           * previous path so the paths do not all have the same
           * first node id
           */
          result = false;
          break;
        }
      }
    }
    return result;
  }

  /**
   * Remove the node id from the paths
   * @param nodeId the node id to remove
   * @param paths an array of paths. each path is an array of node ids
   */
  removeNodeIdFromPaths(nodeId: string, paths: string[][]): void {
    if (nodeId != null && paths != null) {
      for (let path of paths) {
        this.removeNodeIdFromPath(nodeId, path);
      }
    }
  }

  /**
   * Remove the node id from the path
   * @param nodeId the node id to remove
   * @param paths an array of paths. each path is an array of node ids
   * @param pathIndex the path to remove from
   */
  removeNodeIdFromPathWithIndex(nodeId: string, paths: any, pathIndex: number): void {
    if (nodeId != null && paths != null && pathIndex != null) {
      const path = paths[pathIndex];
      if (path != null) {
        this.removeNodeIdFromPath(nodeId, path);
      }
    }
  }

  removeNodeIdFromPath(nodeId: string, path: string[]): void {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === nodeId) {
        path.splice(i, 1);
        /*
         * move the counter back since we just removed a node id. We will continue searching
         * this path for the node id in case the path contains it multiple times.
         */
        i--;
      }
    }
  }

  /**
   * Consolidate all the paths into a linear list of node ids
   * @param paths an array of paths. each path is an array of node ids.
   * @return an array of node ids that have been properly ordered
   */
  consolidatePaths(paths = []): string[] {
    let consolidatedPath = [];
    /*
     * continue until all the paths are empty. as we consolidate
     * node ids, we will remove them from the paths. once all the
     * paths are empty we will be done consolidating the paths.
     */
    while (!this.arePathsEmpty(paths)) {
      const currentPath = this.getNonEmptyPathIndex(paths);
      const nodeId = this.getFirstNodeIdInPathAtIndex(paths, currentPath);
      if (this.areFirstNodeIdsInPathsTheSame(paths)) {
        this.removeNodeIdFromPaths(nodeId, paths);
        consolidatedPath.push(nodeId);
      } else {
        // not all the top node ids are the same which means we have branched
        const pathsThatContainNodeId = this.getPathsThatContainNodeId(nodeId, paths);
        if (pathsThatContainNodeId != null) {
          if (pathsThatContainNodeId.length === 1) {
            // only the current path we are on has the node id
            this.removeNodeIdFromPathWithIndex(nodeId, paths, currentPath);
            consolidatedPath.push(nodeId);
          } else {
            // there are multiple paths that have this node id
            const consumedPath = this.consumePathsUntilNodeId(paths, nodeId);
            this.removeNodeIdFromPaths(nodeId, paths);
            consumedPath.push(nodeId);
            consolidatedPath = consolidatedPath.concat(consumedPath);
          }
        }
      }
    }
    return consolidatedPath;
  }

  /**
   * Consume the node ids in the paths until we get to the given node id
   * @param paths the paths to consume
   * @param nodeId the node id to stop consuming at
   * @return an array of node ids that we have consumed
   */
  private consumePathsUntilNodeId(paths: any[], nodeId: string): any[] {
    const consumedNodes = [];
    for (const path of paths) {
      if (path.includes(nodeId)) {
        const subPath = path.splice(0, path.indexOf(nodeId));
        for (const nodeIdInPath of subPath) {
          if (!consumedNodes.includes(nodeIdInPath)) {
            consumedNodes.push(nodeIdInPath);
          }
        }
      }
    }
    return consumedNodes;
  }

  /**
   * Get the paths that contain the node id
   * @param nodeId the node id we are looking for
   * @param paths an array of paths. each path is an array of node ids
   * @return an array of paths that contain the given node id
   */
  private getPathsThatContainNodeId(nodeId: string, paths = []): string[][] {
    const pathsThatContainNodeId = [];
    for (const path of paths) {
      if (path.indexOf(nodeId) !== -1) {
        pathsThatContainNodeId.push(path);
      }
    }
    return pathsThatContainNodeId;
  }

  /**
   * Get a non empty path index. It will loop through the paths and
   * return the index of the first non empty path.
   * @param paths an array of paths. each path is an array of node ids
   * @return the index of the path that is not empty
   */
  private getNonEmptyPathIndex(paths: string[][] = []): number {
    for (let p = 0; p < paths.length; p++) {
      const path = paths[p];
      if (path.length !== 0) {
        return p;
      }
    }
    return null;
  }
}
