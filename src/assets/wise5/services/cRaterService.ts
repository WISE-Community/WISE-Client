'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './configService';
import { Observable, of } from 'rxjs';
import { CRaterIdea } from '../components/common/cRater/CRaterIdea';
import { CRaterScore } from '../components/common/cRater/CRaterScore';
import { CRaterResponse } from '../components/common/cRater/CRaterResponse';
import { RawCRaterResponse } from '../components/common/cRater/RawCRaterResponse';

@Injectable()
export class CRaterService {
  constructor(protected http: HttpClient, protected configService: ConfigService) {}

  /**
   * Make a CRater request to score student response
   * @param itemId CRater item ID
   * @param responseId number used to keep track of this request
   * @param responseText the student's response to CRater item
   * @returns a promise that returns the result of the CRater request
   */
  makeCRaterScoringRequest(
    itemId: string,
    responseId: number,
    responseText: string
  ): Observable<any> {
    if (itemId === 'MOCK') {
      return this.mockResponse(responseText);
    } else {
      return this.http.post(`${this.configService.getCRaterRequestURL()}/score`, {
        itemId: itemId,
        responseId: responseId,
        responseText: responseText
      });
    }
  }

  private mockResponse(responseText: string): Observable<any> {
    const ideasFound = responseText.match(/idea([a-zA-Z0-9]+)/g) ?? [];
    const isNonScorable = responseText.includes('isNonScorable') ? 1 : 0;
    return of({
      scores: [{ id: 'nonscorable', score: isNonScorable }],
      ideas: ideasFound.map((idea) => {
        return { name: idea, detected: true, characterOffsets: [] };
      })
    });
  }

  private getCRaterItemType(component: any): string {
    return component.cRater != null ? component.cRater.itemType : null;
  }

  getCRaterItemId(component: any): string {
    return component.cRater != null ? component.cRater.itemId : null;
  }

  /**
   * Find when we should perform the CRater scoring
   * @param component the component content
   * @returns when to perform the CRater scoring e.g. 'submit', 'save', 'change', 'exit'
   */
  private getCRaterScoreOn(component: any): string {
    /*
     * CRater can be enabled in two ways
     * 1. the enableCRater field is true
     * 2. there is no enableCRater field but there is a cRater object (this is for legacy purposes)
     */
    if (
      (component.enableCRater && component.cRater != null) ||
      (!component.hasOwnProperty('enableCRater') && component.cRater != null)
    ) {
      return component.cRater.scoreOn;
    }
  }

  isCRaterEnabled(component: any): boolean {
    const cRaterItemType = this.getCRaterItemType(component);
    const cRaterItemId = this.getCRaterItemId(component);
    return component.enableCRater && cRaterItemType != null && cRaterItemId != null;
  }

  /**
   * Check if the CRater is set to score on an event
   * @param component the component content
   * @param event trigger event, 'save', 'submit', or 'change'
   * @returns whether the CRater is set to score when the event is triggered
   */
  isCRaterScoreOnEvent(component: any, event: 'save' | 'submit' | 'change'): boolean {
    const scoreOn = this.getCRaterScoreOn(component);
    return scoreOn != null && scoreOn === event;
  }

  /**
   * Get the CRater scoring rule by score
   * @param component the component content
   * @param score the score
   * @returns the scoring rule for the given score
   */
  private getCRaterScoringRuleByScore(component: any, score: any): any {
    const cRater = component.cRater;
    if (cRater != null) {
      const scoringRules = cRater.scoringRules;
      if (scoringRules != null) {
        for (let tempScoringRule of scoringRules) {
          if (tempScoringRule != null) {
            if (tempScoringRule.score == score) {
              return tempScoringRule;
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Get the feedback text for the given score
   * @param component the component content
   * @param score the score we want feedback for
   * @returns the feedback text for the given score
   */
  getCRaterFeedbackTextByScore(component: any, score: any): any {
    const scoringRule = this.getCRaterScoringRuleByScore(component, score);
    return scoringRule != null ? scoringRule.feedbackText : null;
  }

  /**
   * Get the feedback text for the given previous score and current score
   * @param component the component content
   * @param previousScore the score from the last submit
   * @param currentScore the score from the current submit
   * @returns the feedback text for the given previous score and current score
   */
  getMultipleAttemptCRaterFeedbackTextByScore(
    component: any,
    previousScore: any,
    currentScore: any
  ): string {
    const scoringRule = this.getMultipleAttemptCRaterScoringRuleByScore(
      component,
      previousScore,
      currentScore
    );
    if (scoringRule != null) {
      return scoringRule.feedbackText;
    }
    return null;
  }

  /**
   * Get the multiple attempt CRater scoring rule by previous score and
   * current score
   * @param component the component content
   * @param previousScore the score from the last submit
   * @param currentScore the score from the current submit
   * @returns the scoring rule for the given previous score and current score
   */
  private getMultipleAttemptCRaterScoringRuleByScore(
    component: any,
    previousScore: any,
    currentScore: any
  ): any {
    if (previousScore != null && currentScore != null) {
      const cRater = component.cRater;
      if (cRater != null) {
        const multipleAttemptScoringRules = cRater.multipleAttemptScoringRules;
        if (multipleAttemptScoringRules != null) {
          for (let multipleAttemptScoringRule of multipleAttemptScoringRules) {
            if (multipleAttemptScoringRule != null) {
              const scoreSequence = multipleAttemptScoringRule.scoreSequence;
              if (scoreSequence != null) {
                /*
                 * get the expected previous score and current score
                 * that will satisfy the rule
                 */
                const previousScoreMatch = scoreSequence[0];
                const currentScoreMatch = scoreSequence[1];

                if (
                  previousScore.toString().match('[' + previousScoreMatch + ']') &&
                  currentScore.toString().match('[' + currentScoreMatch + ']')
                ) {
                  /*
                   * the previous score and current score match the
                   * expected scores so we have found the rule we want
                   */
                  return multipleAttemptScoringRule;
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Check if the item id is a valid CRater item id.
   * @param itemId A string.
   * @return A promise that returns whether the item id is valid.
   */
  makeCRaterVerifyRequest(itemId: string): any {
    const url = this.configService.getCRaterRequestURL() + '/verify';
    const params = new HttpParams().set('itemId', itemId);
    const options = {
      params: params
    };
    return this.http
      .get(url, options)
      .toPromise()
      .then((isAvailable: boolean) => {
        return isAvailable;
      });
  }

  getCRaterResponse(responses: RawCRaterResponse, submitCounter: number): CRaterResponse {
    const cRaterResponse: CRaterResponse = new CRaterResponse();
    if (this.isSingleScore(responses)) {
      cRaterResponse.score = this.getScore(responses);
    } else {
      cRaterResponse.scores = this.getScores(responses);
    }
    cRaterResponse.ideas = this.getIdeas(responses);
    cRaterResponse.submitCounter = submitCounter;
    return cRaterResponse;
  }

  private isSingleScore(responses: RawCRaterResponse): boolean {
    return responses.scores != null;
  }

  private getScore(responses: RawCRaterResponse): number {
    return parseInt(responses.scores.raw_trim_round);
  }

  private getScores(responses: RawCRaterResponse): CRaterScore[] {
    const scores = [];
    for (const key in responses.trait_scores) {
      const value = responses.trait_scores[key];
      scores.push(
        new CRaterScore(
          key,
          parseInt(value.raw_trim_round),
          parseFloat(value.raw),
          parseInt(value.score_range_min),
          parseInt(value.score_range_max)
        )
      );
    }
    return scores;
  }

  private getIdeas(responses: RawCRaterResponse): CRaterIdea[] {
    const ideas = [];
    for (const key in responses.feedback.ideas) {
      const value = responses.feedback.ideas[key];
      ideas.push(new CRaterIdea(key, value.detected));
    }
    return ideas;
  }
}
