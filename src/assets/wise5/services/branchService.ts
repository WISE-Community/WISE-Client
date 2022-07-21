import { Injectable } from '@angular/core';
import { Branch } from '../../../app/domain/branch';
import { ConfigService } from './configService';
import { PathService } from './pathService';

@Injectable()
export class BranchService {
  branchesCache: Branch[];

  constructor(private configService: ConfigService, private pathService: PathService) {}

  getBranches(paths: string[][]): Branch[] {
    /*
     * Do not use the branches cache in the authoring tool because the branches
     * may change when the author changes the project. In all other modes the
     * branches can't change so we can use the cache.
     */
    if (this.configService.getMode() != 'author') {
      let branchesCache = this.getBranchesCache();
      if (branchesCache != null) {
        return branchesCache;
      }
    }

    const branches = this.findBranches(paths);
    if (this.configService.getMode() != 'author') {
      this.setBranchesCache(branches);
    }
    return branches;
  }

  private setBranchesCache(branches: Branch[]): void {
    this.branchesCache = branches;
  }

  private getBranchesCache(): Branch[] {
    return this.branchesCache;
  }

  clearBranchesCache() {
    this.branchesCache = null;
  }

  /**
   * Find the branches in the project
   * @param paths all the possible paths through the project
   * @return an array of branch objects. each branch object contains
   * the branch start point, the branch paths, and the branch
   * end point
   */
  private findBranches(paths: string[][]): Branch[] {
    const branches = [];
    let previousNodeId = null;

    /*
     * continue until all the paths are empty. we will remove
     * node ids from the paths as we traverse the paths to find
     * the branches
     */
    while (!this.pathService.arePathsEmpty(paths)) {
      const nodeId = this.pathService.getFirstNodeIdInPathAtIndex(paths, 0);

      if (this.pathService.areFirstNodeIdsInPathsTheSame(paths)) {
        // the first node ids in all the paths are the same

        this.pathService.removeNodeIdFromPaths(nodeId, paths);
        previousNodeId = nodeId;
      } else {
        // not all the top node ids are the same which means we have branched
        const nextCommonNodeId = this.findNextCommonNodeId(paths);
        let branchPaths = this.extractPathsUpToNodeId(paths, nextCommonNodeId);
        branchPaths = this.removeDuplicatePaths(branchPaths);
        branches.push(new Branch(previousNodeId, branchPaths, nextCommonNodeId));

        // trim the paths so that they start at the branch end point
        this.trimPathsUpToNodeId(paths, nextCommonNodeId);

        // remember this node id for the next iteration of the loop
        previousNodeId = nextCommonNodeId;
      }
    }
    return branches;
  }

  /**
   * Extract the paths up to a given node id. This will be used to
   * obtain branch paths.
   * @param paths the paths to extract from
   * @param nodeId the node id to extract up to
   * @return paths that go up to but do not include the node id
   */
  private extractPathsUpToNodeId(paths: string[][], nodeId: string): string[][] {
    const extractedPaths = [];
    if (paths != null) {
      for (let path of paths) {
        if (path != null) {
          let index = path.indexOf(nodeId);
          if (index == -1) {
            /*
             * the node id is not in the path so we will
             * extract up to the end of the path
             */
            index = path.length;
          }

          /*
           * get the path up to the node id index. this does
           * not modify the path array.
           */
          const extractedPath = path.slice(0, index);
          extractedPaths.push(extractedPath);
        }
      }
    }
    return extractedPaths;
  }

  /**
   * Removes duplicate paths
   * @param paths an array of paths. each path contains an array of node ids
   * @return an array of unique paths
   */
  private removeDuplicatePaths(paths: string[][]): string[][] {
    const uniquePaths = [];
    if (paths != null) {
      for (let path of paths) {
        let isPathInUniquePaths = false;
        for (let uniquePath of uniquePaths) {
          if (this.pathsEqual(path, uniquePath)) {
            isPathInUniquePaths = true;
          }
        }

        if (!isPathInUniquePaths) {
          // the path is not equal to any paths in the unique
          // paths array so we will add it to the unique paths array
          uniquePaths.push(path);
        }
      }
    }
    return uniquePaths;
  }

  /**
   * Check if two paths are equal
   * @param path1 an array of node ids
   * @param path2 an array of node ids
   * @return whether the two paths contain the same node ids
   * in the same order
   */
  private pathsEqual(path1: string[], path2: string[]): boolean {
    let result = false;
    if (path1 != null && path2 != null) {
      if (path1.length === path2.length) {
        result = true;

        for (let x = 0; x < path1.length; x++) {
          const path1NodeId = path1[x];
          const path2NodeId = path2[x];
          if (path1NodeId !== path2NodeId) {
            result = false;
            break;
          }
        }
      }
    }
    return result;
  }

  /**
   * Trim the paths up to the given node id so that the paths will contain
   * the given node id and all the node ids after it. This function will
   * modify the paths.
   * @param paths the paths to trim
   * @param nodeId the node id to trim up to
   */
  private trimPathsUpToNodeId(paths: string[][], nodeId: string): void {
    if (paths != null) {
      for (let path of paths) {
        if (path != null) {
          let index = path.indexOf(nodeId);

          if (index == -1) {
            /*
             * the node id is not in the path so we will
             * trim the path to the end which will make
             * the path empty
             */
            index = path.length;
          }

          /*
           * trim the path up to the node id index. this will
           * modify the path array.
           */
          path.splice(0, index);
        }
      }
    }
  }

  /**
   * Find the next common node id in all the paths
   * @param paths the paths to find the common node id in
   * @return a node id that is in all the paths or null
   * if there is no node id that is in all the paths
   */
  private findNextCommonNodeId(paths: string[][]): string {
    let nextCommonNodeId = null;
    if (paths != null) {
      if (paths.length > 0) {
        const path = paths[0];
        for (let tempNodeId of path) {
          if (this.allPathsContainNodeId(paths, tempNodeId)) {
            /*
             * the node id is in all the paths so we have found
             * what we were looking for
             */
            nextCommonNodeId = tempNodeId;
            break;
          }
        }
      }
    }
    return nextCommonNodeId;
  }

  /**
   * Check if all the paths contain the node id
   * @param paths an array of paths. each path contains an array of node ids
   * @param nodeId the node id that we will check is in all the paths
   * @return whether the node id is in all the paths
   */
  private allPathsContainNodeId(paths: string[][], nodeId: string): boolean {
    let result = false;
    if (paths != null) {
      for (let path of paths) {
        const index = path.indexOf(nodeId);
        if (index == -1) {
          result = false;
          break;
        } else {
          result = true;
        }
      }
    }
    return result;
  }
}
