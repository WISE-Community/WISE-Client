import { PlotLineManager } from './plot-line-manager';

let plotLineManager: PlotLineManager;

describe('PlotLineManager', () => {
  beforeEach(() => {
    plotLineManager = new PlotLineManager([], true, true);
  });

  getXPlotLines();
  setXPlotLine();
  isShowMousePlotLine();
  isShowMouseXPlotLine();
  isShowMouseYPlotLine();
});

function getXPlotLines(): void {
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
      plotLineManager = new PlotLineManager(xPlotLines, true, true);
      expect(plotLineManager.getXPlotLines()).toEqual(xPlotLines);
    });
  });
}

function setXPlotLine(): void {
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

function isShowMousePlotLine(): void {
  describe('isShowMousePlotLine()', () => {
    describe('when show mouse x and y plot line are false', () => {
      it('should return show mouse plot line false', () => {
        setPlotLineManagerShowMouseXY(false, false);
        expect(plotLineManager.isShowMousePlotLine()).toBe(false);
      });
    });
    describe('when show mouse x is true and y is false', () => {
      it('should return show mouse plot line true', () => {
        setPlotLineManagerShowMouseXY(true, false);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
    describe('when show mouse x is false and y is true', () => {
      it('should return show mouse plot line true', () => {
        setPlotLineManagerShowMouseXY(false, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
    describe('when show mouse x and y plot line are true', () => {
      it('should return show mouse plot line true', () => {
        setPlotLineManagerShowMouseXY(true, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
      });
    });
  });
}

function isShowMouseXPlotLine(): void {
  describe('isShowMouseXPlotLine()', () => {
    describe('when show mouse x plot line is false', () => {
      it('should return false', () => {
        setPlotLineManagerShowMouseXY(false, true);
        expect(plotLineManager.isShowMouseXPlotLine()).toBe(false);
      });
    });
    describe('when show mouse x plot line is true', () => {
      it('should return true', () => {
        setPlotLineManagerShowMouseXY(true, false);
        expect(plotLineManager.isShowMouseXPlotLine()).toBe(true);
      });
    });
  });
}

function isShowMouseYPlotLine(): void {
  describe('isShowMouseYPlotLine()', () => {
    describe('when show mouse y plot line is false', () => {
      it('should return false', () => {
        setPlotLineManagerShowMouseXY(true, false);
        expect(plotLineManager.isShowMouseYPlotLine()).toBe(false);
      });
    });
    describe('when show mouse y plot line is true', () => {
      it('should return true', () => {
        setPlotLineManagerShowMouseXY(false, true);
        expect(plotLineManager.isShowMouseYPlotLine()).toBe(true);
      });
    });
  });
}

function setPlotLineManagerShowMouseXY(
  showMouseXPlotLine: boolean,
  showMouseYPlotLine: boolean
): void {
  plotLineManager = new PlotLineManager([], showMouseXPlotLine, showMouseYPlotLine);
}
