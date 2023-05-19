import { PlotLineManager } from './plot-line-manager';

let plotLineManager: PlotLineManager;

describe('PlotLineManager', () => {
  beforeEach(() => {
    plotLineManager = new PlotLineManager([], true, true);
  });

  getXPlotLines();
  setXPlotLine();
  isShowMousePlotLine();
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
    describe('when show mouse x or y plot line is true', () => {
      it('should return show mouse plot line true', () => {
        setPlotLineManagerShowMouseXY(true, false);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
        setPlotLineManagerShowMouseXY(false, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
        setPlotLineManagerShowMouseXY(true, true);
        expect(plotLineManager.isShowMousePlotLine()).toBe(true);
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
