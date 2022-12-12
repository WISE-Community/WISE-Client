import { TestBed } from '@angular/core/testing';
import { CRaterService } from '../../assets/wise5/services/cRaterService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilService } from '../../assets/wise5/services/utilService';
import { CRaterIdea } from '../../assets/wise5/components/common/cRater/CRaterIdea';
import { CRaterScore } from '../../assets/wise5/components/common/cRater/CRaterScore';
let service: CRaterService;
let configService: ConfigService;
let http: HttpTestingController;

describe('CRaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, CRaterService, UtilService]
    });
    http = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(CRaterService);
  });

  makeCRaterScoringRequest();
  getCRaterItemId();
  isCRaterEnabled();
  isCRaterScoreOnEvent();
  getCRaterFeedbackTextByScore();
  getMultipleAttemptCRaterFeedbackTextByScore();
  makeCRaterVerifyRequest();
  getDataFromResponse();
});

function makeCRaterScoringRequest() {
  describe('makeCRaterScoringRequest()', () => {
    it('should make a CRater scoring request', () => {
      spyOn(configService, 'getCRaterRequestURL').and.returnValue('/c-rater');
      const itemId = 'ColdBeverage1Sub';
      const responseId = 1;
      const responseText = 'Hello World.';
      service.makeCRaterScoringRequest(itemId, responseId, responseText).subscribe();
      const request = http.expectOne(`/c-rater/score`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual({
        itemId: itemId,
        responseId: responseId,
        responseText: responseText
      });
    });
  });
}

function getCRaterItemId() {
  describe('getCRaterItemId()', () => {
    it('should get the CRater Id', () => {
      const itemId = 'ColdBeverage1Sub';
      const component = {
        cRater: {
          itemId: itemId
        }
      };
      expect(service.getCRaterItemId(component)).toEqual(itemId);
    });
  });
}

function isCRaterEnabled() {
  describe('isCRaterEnabled()', () => {
    it('should check if CRater is enabled', () => {
      const component = {
        enableCRater: true,
        cRater: {
          itemType: 'CRATER',
          itemId: 'ColdBeverage1Sub'
        }
      };
      expect(service.isCRaterEnabled(component)).toEqual(true);
      component.enableCRater = false;
      expect(service.isCRaterEnabled(component)).toEqual(false);
    });
  });
}

function isCRaterScoreOnEvent() {
  describe('isCRaterScoreOnEvent()', () => {
    it('should get is CRater score on save when true', () => {
      const component = createScoreOnComponent('save');
      expect(service.isCRaterScoreOnEvent(component, 'save')).toEqual(true);
    });

    it('should get is CRater score on save when false', () => {
      const component = createScoreOnComponent('submit');
      expect(service.isCRaterScoreOnEvent(component, 'save')).toEqual(false);
    });
  });
}

function createScoreOnComponent(scoreOn) {
  return {
    cRater: {
      scoreOn: scoreOn
    }
  };
}

function createScoringRule(score, feedbackText) {
  return {
    score: score,
    feedbackText: feedbackText
  };
}

function getCRaterFeedbackTextByScore() {
  describe('getCRaterFeedbackTextByScore()', () => {
    const feedbackText1 = 'You received a score of 1.';
    const feedbackText2 = 'You received a score of 2.';
    const scoringRule1 = createScoringRule(1, feedbackText1);
    const scoringRule2 = createScoringRule(2, feedbackText2);
    const component = {
      cRater: {
        scoringRules: [scoringRule1, scoringRule2]
      }
    };
    it('should get CRater feedback text by score 1', () => {
      expect(service.getCRaterFeedbackTextByScore(component, 1)).toEqual(feedbackText1);
    });

    it('should get CRater feedback text by score 2', () => {
      expect(service.getCRaterFeedbackTextByScore(component, 2)).toEqual(feedbackText2);
    });
  });
}

function getMultipleAttemptCRaterFeedbackTextByScore() {
  describe('getMultipleAttemptCRaterFeedbackTextByScore()', () => {
    const feedbackText1 = 'You improved a little.';
    const feedbackText2 = 'You got worse.';
    const component = {
      cRater: {
        multipleAttemptScoringRules: [
          {
            scoreSequence: [1, 2],
            feedbackText: feedbackText1
          },
          {
            scoreSequence: [2, 1],
            feedbackText: feedbackText2
          }
        ]
      }
    };

    it('should get multiple attempt CRater feedback text by score 1 then 2', () => {
      expect(service.getMultipleAttemptCRaterFeedbackTextByScore(component, 1, 2)).toEqual(
        feedbackText1
      );
    });

    it('should get multiple attempt CRater feedback text by score 2 then 1', () => {
      expect(service.getMultipleAttemptCRaterFeedbackTextByScore(component, 2, 1)).toEqual(
        feedbackText2
      );
    });
  });
}

function makeCRaterVerifyRequest() {
  describe('makeCRaterVerifyRequest()', () => {
    it('should make a CRater verify request', () => {
      spyOn(configService, 'getCRaterRequestURL').and.returnValue('/c-rater');
      const itemId = 'ColdBeverage1Sub';
      service.makeCRaterVerifyRequest(itemId);
      http.expectOne({
        url: `/c-rater/verify?itemId=${itemId}`,
        method: 'GET'
      });
    });
  });
}

function getDataFromResponse() {
  describe('getDataFromResponse()', () => {
    it('should get single score data from response', () => {
      const score = 1;
      const idea1Detected = true;
      const response = {
        responses: {
          feedback: {
            ideas: {
              1: {
                detected: idea1Detected
              }
            }
          },
          scores: {
            raw_trim_round: score
          }
        }
      };
      const cRaterResponse = service.getCRaterResponse(response, 1);
      expect(cRaterResponse.score).toEqual(score);
      expect(cRaterResponse.ideas).toEqual([new CRaterIdea('1', idea1Detected)]);
    });

    it('should get multiple scores data from response', () => {
      const kiRaw = 2.2;
      const kiRawTrimRound = 2;
      const kiScoreRangeMax = 5;
      const kiScoreRangeMin = 1;
      const dciRaw = 1.1;
      const dciRawTrimRound = 1;
      const dciScoreRangeMax = 3;
      const dciScoreRangeMin = 1;
      const idea1Detected = true;
      const idea2Detected = false;
      const response = {
        responses: {
          feedback: {
            ideas: {
              1: {
                detected: idea1Detected
              },
              2: {
                detected: idea2Detected
              }
            }
          },
          trait_scores: {
            ki: {
              raw: kiRaw,
              raw_trim_round: kiRawTrimRound,
              score_range_max: kiScoreRangeMax,
              score_range_min: kiScoreRangeMin
            },
            dci: {
              raw: dciRaw,
              raw_trim_round: dciRawTrimRound,
              score_range_max: dciScoreRangeMax,
              score_range_min: dciScoreRangeMin
            }
          }
        }
      };
      const cRaterResponse = service.getCRaterResponse(response, 1);
      expect(cRaterResponse.scores).toEqual([
        new CRaterScore('ki', kiRawTrimRound, kiRaw, kiScoreRangeMin, kiScoreRangeMax),
        new CRaterScore('dci', dciRawTrimRound, dciRaw, dciScoreRangeMin, dciScoreRangeMax)
      ]);
      expect(cRaterResponse.ideas).toEqual([
        new CRaterIdea('1', idea1Detected),
        new CRaterIdea('2', idea2Detected)
      ]);
    });

    it('should get data from response when there are no ideas', () => {
      const score = 1;
      const response = {
        responses: {
          feedback: {
            ideas: {}
          },
          scores: {
            raw_trim_round: score
          }
        }
      };
      const cRaterResponse = service.getCRaterResponse(response, 1);
      expect(cRaterResponse.score).toEqual(score);
      expect(cRaterResponse.ideas).toEqual([]);
    });
  });
}
