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

/**
 * Temporarily highlight the nodes and scroll to the first node to draw attention to them
 * @param nodes the nodes to highlight
 */
export function highlightNodesAndScroll(nodes = []): void {
  if (nodes.length > 0) {
    setTimeout(() => {
      nodes.forEach((node) => temporarilyHighlightElement(node.id));
      $('#content').animate(
        {
          scrollTop: $('#' + nodes[0].id).prop('offsetTop') - 60
        },
        1000
      );
    });
  }
}
