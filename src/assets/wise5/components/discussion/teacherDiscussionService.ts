import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { TeacherDataService } from '../../services/teacherDataService';
import { DiscussionService } from './discussionService';

@Injectable()
export class TeacherDiscussionService extends DiscussionService {
  constructor(
    protected http: HttpClient,
    protected configService: ConfigService,
    protected teacherDataService: TeacherDataService
  ) {
    super(http, configService);
  }

  getPostsAssociatedWithComponentIdsAndWorkgroupId(componentIds: string[], workgroupId: number) {
    let allPosts = [];
    const topLevelComponentStateIdsFound = [];
    const componentStates = this.teacherDataService.getComponentStatesByWorkgroupIdAndComponentIds(
      workgroupId,
      componentIds
    );
    for (const componentState of componentStates) {
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

  getPostAndAllRepliesByComponentIds(componentIds: string[], componentStateId: number) {
    const postAndAllReplies = [];
    const componentStatesForComponentIds = this.teacherDataService.getComponentStatesByComponentIds(
      componentIds
    );
    for (const componentState of componentStatesForComponentIds) {
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
