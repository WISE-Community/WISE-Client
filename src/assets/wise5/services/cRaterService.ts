'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './configService';
import { Observable, of } from 'rxjs';
import { CRaterIdea } from '../components/dialogGuidance/CRaterIdea';
import { CRaterScore } from '../components/dialogGuidance/CRaterScore';
import { CRaterResponse } from '../components/dialogGuidance/CRaterResponse';

@Injectable()
export class CRaterService {
  constructor(protected http: HttpClient, protected ConfigService: ConfigService) {}

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
      return this.http.post(`${this.ConfigService.getCRaterRequestURL()}/score`, {
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

  /**
   * Get the CRater item type from the component
   * @param component the component content
   */
  getCRaterItemType(component: any) {
    if (component != null && component.cRater != null) {
      return component.cRater.itemType;
    }
    return null;
  }

  /**
   * Get the CRater item id from the component
   * @param component the component content
   */
  getCRaterItemId(component: any) {
    if (component != null && component.cRater != null) {
      return component.cRater.itemId;
    }
    return null;
  }

  /**
   * Find when we should perform the CRater scoring
   * @param component the component content
   * @returns when to perform the CRater scoring e.g. 'submit', 'save', 'change', 'exit'
   */
  getCRaterScoreOn(component: any) {
    if (component != null) {
      /*
       * CRater can be enabled in two ways
       * 1. the enableCRater field is true
       * 2. there is no enableCRater field but there is a cRater object (this is for legacy purposes)
       */
      if (
        (component.enableCRater && component.cRater != null) ||
        (!component.hasOwnProperty('enableCRater') && component.cRater != null)
      ) {
        // get the score on value e.g. 'submit', 'save', 'change', or 'exit'
        return component.cRater.scoreOn;
      }
    }
    return null;
  }

  /**
   * Check if CRater is enabled for this component
   * @param component the component content
   */
  isCRaterEnabled(component: any) {
    if (component != null) {
      // get the item type and item id
      const cRaterItemType = this.getCRaterItemType(component);
      const cRaterItemId = this.getCRaterItemId(component);
      if (component.enableCRater && cRaterItemType != null && cRaterItemId != null) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the CRater is set to score on save
   * @param component the component content
   * @returns whether the CRater is set to score on save
   */
  isCRaterScoreOnSave(component: any) {
    if (component != null) {
      // find when we should perform the CRater scoring
      const scoreOn = this.getCRaterScoreOn(component);
      if (scoreOn != null && scoreOn === 'save') {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the CRater is set to score on submit
   * @param component the component content
   * @returns whether the CRater is set to score on submit
   */
  isCRaterScoreOnSubmit(component: any) {
    if (component != null) {
      // find when we should perform the CRater scoring
      const scoreOn = this.getCRaterScoreOn(component);
      if (scoreOn != null && scoreOn === 'submit') {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the CRater is set to score on change
   * @param component the component content
   * @returns whether the CRater is set to score on change
   */
  isCRaterScoreOnChange(component: any) {
    if (component != null) {
      // find when we should perform the CRater scoring
      const scoreOn = this.getCRaterScoreOn(component);
      if (scoreOn != null && scoreOn === 'change') {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the CRater is set to score on exit
   * @param component the component content
   * @returns whether the CRater is set to score on exit
   */
  isCRaterScoreOnExit(component: any) {
    if (component != null) {
      // find when we should perform the CRater scoring
      const scoreOn = this.getCRaterScoreOn(component);
      if (scoreOn != null && scoreOn === 'exit') {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the CRater scoring rule by score
   * @param component the component content
   * @param score the score
   * @returns the scoring rule for the given score
   */
  getCRaterScoringRuleByScore(component: any, score: any) {
    if (component != null && score != null) {
      const cRater = component.cRater;
      if (cRater != null) {
        const scoringRules = cRater.scoringRules;
        if (scoringRules != null) {
          // loop through all the scoring rules
          for (let tempScoringRule of scoringRules) {
            if (tempScoringRule != null) {
              if (tempScoringRule.score == score) {
                /*
                 * the score matches so we have found
                 * the scoring rule that we want
                 */
                return tempScoringRule;
              }
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
  getCRaterFeedbackTextByScore(component: any, score: any) {
    const scoringRule = this.getCRaterScoringRuleByScore(component, score);
    if (scoringRule != null) {
      return scoringRule.feedbackText;
    }
    return null;
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
  ) {
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
  getMultipleAttemptCRaterScoringRuleByScore(
    component: any,
    previousScore: any,
    currentScore: any
  ) {
    if (component != null && previousScore != null && currentScore != null) {
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
  makeCRaterVerifyRequest(itemId: string) {
    const url = this.ConfigService.getCRaterRequestURL() + '/verify';
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

  public getCRaterResponse(response: any): CRaterResponse {
    const cRaterResponse: CRaterResponse = new CRaterResponse();
    if (this.isSingleScore(response)) {
      cRaterResponse.score = this.getScore(response);
    } else {
      cRaterResponse.scores = this.getScores(response);
    }
    cRaterResponse.ideas = this.getIdeas(response);
    return cRaterResponse;
  }

  private isSingleScore(response: any): boolean {
    return response.responses.scores != null;
  }

  private getScore(response: any): number {
    return response.responses.scores.raw_trim_round;
  }

  private getScores(response: any): CRaterScore[] {
    const scores = [];
    for (const key in response.responses.trait_scores) {
      const value = response.responses.trait_scores[key];
      scores.push(
        new CRaterScore(
          key,
          value.raw_trim_round,
          value.raw,
          value.score_range_min,
          value.score_range_max
        )
      );
    }
    return scores;
  }

  private getIdeas(response: any): CRaterIdea[] {
    const ideas = [];
    for (const key in response.responses.feedback.ideas) {
      const value = response.responses.feedback.ideas[key];
      ideas.push(new CRaterIdea(key, value.detected));
    }
    return ideas;
  }
}
