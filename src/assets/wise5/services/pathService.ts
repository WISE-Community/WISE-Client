import { Injectable } from '@angular/core';

@Injectable()
export class PathService {
  /**
   * Check if all the paths are empty
   * @param paths an array of paths. each path is an array of node ids
   * @return whether all the paths are empty
   */
  arePathsEmpty(paths: string[][]): boolean {
    if (paths != null) {
      for (let path of paths) {
        if (path != null) {
          if (path.length !== 0) {
            return false;
          }
        }
      }
    }
    return true;
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
   * Remove the node ifrom the paths
   * @param nodeId the node id to remove
   * @param paths an array of paths. each path is an array of node ids
   */
  removeNodeIdFromPaths(nodeId: string, paths: string[][]): void {
    if (nodeId != null && paths != null) {
      for (let path of paths) {
        for (let x = 0; x < path.length; x++) {
          const tempNodeId = path[x];

          /*
           * check if the node id matches the one we are looking
           * for
           */
          if (nodeId === tempNodeId) {
            /*
             * we have found the node id we are looking for so
             * we will remove it from the path
             */
            path.splice(x, 1);

            /*
             * move the counter back since we just removed a
             * node id. we will continue searching this path
             * for the node id in case the path contains it
             * multiple times.
             */
            x--;
          }
        }
      }
    }
  }
}
