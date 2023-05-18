import { PlotLineManager } from './plot-line-manager';

let plotLineManager: PlotLineManager;

describe('PlotLineManager', () => {
  beforeEach(() => {
    plotLineManager = new PlotLineManager([], [], true, true);
  });

  getXPlotLines();
  setXPlotLine();
  isShowMousePlotLine();
  isShowMouseXPlotLine();
  isShowMouseYPlotLine();
});

function getXPlotLines() {
  describe('getXPlotLines()', () => {
    it('should return the x axis plot lines', () => {
      const xPlotLines = [
        {
          color: 'red',
          width: 2,
          value: 10,
          zIndex: 5
        }
      ];
      plotLineManager = new PlotLineManager(xPlotLines, [], true, true);
      expect(plotLineManager.getXPlotLines()).toEqual(xPlotLines);
    });
  });
}

function setXPlotLine() {
  describe('setXPlotLine()', () => {
    it('should set the plot line', () => {
      plotLineManager.setXPlotLine(1);
      expect(plotLineManager.getXPlotLines()).toEqual([
        {
          color: 'red',
          width: 2,
          value: 1,
          zIndex: 5
        }
      ]);
    });
  });
}

function isShowMousePlotLine() {
  describe('isShowMousePlotLine()', () => {
    describe('when show mouse x and y plot line are false', () => {
      it('should return show mouse plot line false', () => {
        plotLineManager = new PlotLineManager([], [], false, false);
        expect(plotLineManager.isShowMousePlotLine()).toBe(false);
      });
    });
    describe('when show mouse x is true and y is false', () => {
      it('should return show mouse plot line true', () => {
        plotLineManager = new PlotLineManager([], [], true, false);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
    describe('when show mouse x is false and y is true', () => {
      it('should return show mouse plot line true', () => {
        plotLineManager = new PlotLineManager([], [], false, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
    describe('when show mouse x and y plot line are true', () => {
      it('should return show mouse plot line true', () => {
        plotLineManager = new PlotLineManager([], [], true, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
  });
}

function isShowMouseXPlotLine() {
  describe('isShowMouseXPlotLine()', () => {
    describe('when show mouse x plot line is false', () => {
      it('should return false', () => {
        plotLineManager = new PlotLineManager([], [], false, false);
        expect(plotLineManager.isShowMouseXPlotLine()).toBe(false);
      });
    });
    describe('when show mouse x plot line is true', () => {
      it('should return true', () => {
        plotLineManager = new PlotLineManager([], [], true, true);
        expect(plotLineManager.isShowMouseXPlotLine()).toBe(true);
      });
    });
  });
}

function isShowMouseYPlotLine() {
  describe('isShowMouseYPlotLine()', () => {
    describe('when show mouse y plot line is false', () => {
      it('should return false', () => {
        plotLineManager = new PlotLineManager([], [], false, false);
        expect(plotLineManager.isShowMouseYPlotLine()).toBe(false);
      });
    });
    describe('when show mouse y plot line is true', () => {
      it('should return true', () => {
        plotLineManager = new PlotLineManager([], [], true, true);
        expect(plotLineManager.isShowMouseYPlotLine()).toBe(true);
      });
    });
  });
}
