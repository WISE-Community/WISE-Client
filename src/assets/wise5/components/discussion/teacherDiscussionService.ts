import { inject, Injectable } from '@angular/core';
import { TeacherDataService } from '../../services/teacherDataService';
import { DiscussionService } from './discussionService';
import { getIntersectOfArrays } from '../../common/array/array';

@Injectable()
export class TeacherDiscussionService extends DiscussionService {
  protected dataService = inject(TeacherDataService);

  getPostsAssociatedWithComponentIdsAndWorkgroupId(componentIds: string[], workgroupId: number) {
    let allPosts = [];
    const topLevelComponentStateIdsFound = [];
    for (const componentState of this.getComponentStates(workgroupId, componentIds)) {
      const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
      if (this.isTopLevelPost(componentState)) {
        if (
          !this.isTopLevelComponentStateIdFound(topLevelComponentStateIdsFound, componentState.id)
        ) {
          allPosts = allPosts.concat(
            this.getPostAndAllRepliesByComponentIds(componentIds, componentState.id)
          );
          topLevelComponentStateIdsFound.push(componentState.id);
        }
      } else {
        if (
          !this.isTopLevelComponentStateIdFound(
            topLevelComponentStateIdsFound,
            componentStateIdReplyingTo
          )
        ) {
          allPosts = allPosts.concat(
            this.getPostAndAllRepliesByComponentIds(componentIds, componentStateIdReplyingTo)
          );
          topLevelComponentStateIdsFound.push(componentStateIdReplyingTo);
        }
      }
    }
    return allPosts;
  }

  private getComponentStates(workgroupId: number, componentIds: string[]): any[] {
    const workgroupComponentStates = this.dataService.getComponentStatesByWorkgroupId(workgroupId);
    const componentStates = componentIds.flatMap((componentId) =>
      this.dataService.getComponentStatesByComponentId(componentId)
    );
    return getIntersectOfArrays(workgroupComponentStates, componentStates);
  }

  getPostAndAllRepliesByComponentIds(componentIds: string[], componentStateId: number) {
    const postAndAllReplies = [];
    const componentStates = componentIds.flatMap((componentId) =>
      this.dataService.getComponentStatesByComponentId(componentId)
    );
    for (const componentState of componentStates) {
      if (componentState.id === componentStateId) {
        postAndAllReplies.push(componentState);
      } else {
        const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
        if (componentStateIdReplyingTo === componentStateId) {
          postAndAllReplies.push(componentState);
        }
      }
    }
    return postAndAllReplies;
  }
}
