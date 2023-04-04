export class GraphCustomLegend {
  static readonly HIGHCHARTS_LEGEND_CLASS: string = 'highcharts-legend';
  static readonly TRANSFORM_ATTRIBUTE_NAME: string = 'transform';

  customLegend: string;
  highchartsDivId: string;
  legendElementSelector: string;

  constructor(highchartsDivId: string, customLegend: string) {
    this.highchartsDivId = highchartsDivId;
    this.customLegend = customLegend;
    this.legendElementSelector = `#${this.highchartsDivId} .${GraphCustomLegend.HIGHCHARTS_LEGEND_CLASS}`;
  }

  render(): void {
    this.moveLegendToVeryLeft();
    $(this.legendElementSelector).html(this.customLegend);
  }

  private moveLegendToVeryLeft(): void {
    if (navigator.userAgent.includes('Firefox')) {
      this.moveLegendInFirefox();
    } else {
      this.moveLegendInOtherBrowsers();
    }
  }

  private moveLegendInFirefox(): void {
    /*
     * Regex to split the transform string into three groups. We will use this to replace the x
     * value of the translate.
     * Example
     * "translate(227, 294)"
     * The regex will create three groups
     * group 1 = "translate("
     * group 2 = "227"
     * group 3 = ", 294)"
     * The x value of the translate is captured in group 2.
     */
    const translateRegEx = /(translate\()(\d*)(,\s*\d*\))/;
    const currentTransform = $(this.legendElementSelector).attr(
      GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME
    );
    const newTransform = this.setXtoZero(currentTransform, translateRegEx);
    $(this.legendElementSelector).attr(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME, newTransform);
  }

  private moveLegendInOtherBrowsers(): void {
    /*
     * Regex to split the transform string into three groups. We will use this to replace the x
     * value of the matrix.
     * Example
     * "matrix(1, 0, 0, 1, 227, 294)"
     * The regex will create three groups
     * group 1 = "matrix(1, 0, 0, 1, "
     * group 2 = "227"
     * group 3 = ", 294)"
     * The x value of the matrix is captured in group 2.
     */
    const matrixRegEx = /(matrix\(\d*,\s*\d*,\s*\d*,\s*\d*,\s*)(\d*)(,\s*\d*\))/;
    const currentTransform = $(this.legendElementSelector).css(
      GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME
    );
    const newTransform = this.setXtoZero(currentTransform, matrixRegEx);
    $(this.legendElementSelector).css(GraphCustomLegend.TRANSFORM_ATTRIBUTE_NAME, newTransform);
  }

  private setXtoZero(transform: string, regEx: RegExp): string {
    // replace the second group with 0
    return transform.replace(regEx, '$10$3');
  }
}
