import { GraphCustomLegend } from './GraphCustomLegend';

const graphDivId = 'my-chart';
const customLegendHtml = 'custom legend';

describe('GraphCustomLegend', () => {
  render();
});

function render() {
  let graphDiv: HTMLElement;

  describe('render()', () => {
    beforeEach(() => {
      graphDiv = createGraphDiv(graphDivId);
      document.body.appendChild(graphDiv);
    });

    afterEach(() => {
      $(graphDiv).remove();
    });

    it('should render the legend in Firefox', () => {
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('Firefox');
      const legendDiv = createFirefoxLegendDiv('translate(227, 294)');
      graphDiv.appendChild(legendDiv);
      new GraphCustomLegend(graphDivId, customLegendHtml).render();
      expect($(legendDiv).attr(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME)).toEqual(
        'translate(0, 294)'
      );
      expect($(legendDiv).html()).toBe(customLegendHtml);
    });

    it('should render the legend in Chrome', () => {
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('Chrome');
      const legendDiv = createChromeLegendDiv('matrix(1, 0, 0, 1, 227, 294)');
      graphDiv.appendChild(legendDiv);
      new GraphCustomLegend(graphDivId, customLegendHtml).render();
      expect($(legendDiv).css(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME)).toEqual(
        'matrix(1, 0, 0, 1, 0, 294)'
      );
      expect($(legendDiv).html()).toBe(customLegendHtml);
    });
  });
}

function createGraphDiv(id: string): HTMLElement {
  const graphDiv = document.createElement('div');
  $(graphDiv).attr('id', id);
  return graphDiv;
}

function createChromeLegendDiv(transform: string): HTMLElement {
  const legendDiv = createDivWithClass(GraphCustomLegend.HIGHCHARTS_LEGEND_CLASS);
  $(legendDiv).css(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME, transform);
  return legendDiv;
}

function createFirefoxLegendDiv(transform: string): HTMLElement {
  const legendDiv = createDivWithClass(GraphCustomLegend.HIGHCHARTS_LEGEND_CLASS);
  $(legendDiv).attr(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME, transform);
  return legendDiv;
}

function createDivWithClass(className: string): HTMLElement {
  const div = document.createElement('div');
  $(div).addClass(className);
  return div;
}
