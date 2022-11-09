import { CRaterResponse } from './CRaterResponse';
import { CRaterScore } from './CRaterScore';

const response = new CRaterResponse();
describe('CRaterResponse', () => {
  getDetectedIdeaNames();
  getKIScore();
  isNonScorable();
});

function getDetectedIdeaNames() {
  describe('getDetectedIdeaNames()', () => {
    it('should return ideas that were detected in the response', () => {
      response.ideas = [
        { name: 'idea1', detected: true, characterOffsets: [] },
        { name: 'idea2', detected: false, characterOffsets: [] },
        { name: 'idea3', detected: true, characterOffsets: [] }
      ];
      expect(response.getDetectedIdeaNames()).toEqual(['idea1', 'idea3']);
    });
  });
}

function getKIScore() {
  describe('getKIScore()', () => {
    it('should return the KI score', () => {
      response.scores = [new CRaterScore('ki', 2, 2.13, 1, 5)];
      expect(response.getKIScore()).toEqual(2);
    });
  });
}

function isNonScorable() {
  describe('isNonScorable()', () => {
    it('should return true for non-scorable item and false for scorable item', () => {
      response.scores = [new CRaterScore('nonscorable', 1, 1, 1, 5)];
      expect(response.isNonScorable()).toBeTruthy();
      response.scores = [new CRaterScore('nonscorable', 0, 0, 1, 5)];
      expect(response.isNonScorable()).toBeFalsy();
    });
  });
}
