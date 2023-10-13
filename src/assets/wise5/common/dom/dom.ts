/**
 * Temporarily highlight an element in the DOM
 * @param id The id of the element
 * @param duration The number of milliseconds to keep the element highlighted
 */
export function temporarilyHighlightElement(id: string, duration: number = 1000): void {
  const element = $('#' + id);
  const originalBackgroundColor = element.css('backgroundColor');
  element.css('background-color', '#FFFF9C');

  /*
   * Use a timeout before starting to transition back to the original background color. For some
   * reason the element won't get highlighted in the first place unless this timeout is used.
   */
  setTimeout(() => {
    // slowly fade back to the original background color
    element.css({
      transition: 'background-color 2s ease-in-out',
      'background-color': originalBackgroundColor
    });

    /*
     * remove these styling fields after we perform the fade otherwise the regular mouseover
     * background color change will not work
     */
    setTimeout(() => {
      element.css({
        transition: '',
        'background-color': ''
      });
    }, 2000);
  }, duration);
}

export function scrollToElement(elementId: string): void {
  $('#content').animate(
    {
      scrollTop: $(`#${elementId}`).prop('offsetTop')
    },
    1000
  );
}
