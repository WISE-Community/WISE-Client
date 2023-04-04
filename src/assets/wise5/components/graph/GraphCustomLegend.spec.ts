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
      const legendDiv = createLegendAndRender('Firefox', graphDiv, 'translate(227, 294)');
      expect($(legendDiv).attr(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME)).toEqual(
        'translate(0, 294)'
      );
      expect($(legendDiv).html()).toBe(customLegendHtml);
    });

    it('should render the legend in Chrome', () => {
      const legendDiv = createLegendAndRender('Chrome', graphDiv, 'matrix(1, 0, 0, 1, 227, 294)');
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

function createLegendAndRender(
  browserName: string,
  graphDiv: HTMLElement,
  transform: string
): HTMLElement {
  spyOnProperty(window.navigator, 'userAgent').and.returnValue(browserName);
  const legendDiv: HTMLElement =
    browserName === 'Firefox'
      ? createFirefoxLegendDiv(transform)
      : createChromeLegendDiv(transform);
  graphDiv.appendChild(legendDiv);
  new GraphCustomLegend(graphDivId, customLegendHtml).render();
  return legendDiv;
}

function createFirefoxLegendDiv(transform: string): HTMLElement {
  return createLegendDiv('attr', transform);
}

function createChromeLegendDiv(transform: string): HTMLElement {
  return createLegendDiv('css', transform);
}

function createLegendDiv(functionName: string, transform: string): HTMLElement {
  const legendDiv = createDivWithClass(GraphCustomLegend.HIGHCHARTS_LEGEND_CLASS);
  $(legendDiv)[functionName](GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME, transform);
  return legendDiv;
}

function createDivWithClass(className: string): HTMLElement {
  const div = document.createElement('div');
  $(div).addClass(className);
  return div;
}
