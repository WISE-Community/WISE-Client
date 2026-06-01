/**
 * Temporarily highlight an element in the DOM
 * @param id The id of the element
 * @param duration The number of milliseconds to keep the element highlighted
 */
export function temporarilyHighlightElement(id: string, duration: number = 1000): void {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }
  element.classList.add('highlighted-bg');
  setTimeout(() => {
    element.style.transition = 'background-color 2s ease-in-out';
    element.classList.remove('highlighted-bg');
    setTimeout(() => {
      element.style.transition = '';
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

export function scrollToTopOfPage(): void {
  document.getElementById('top').scrollIntoView();
}
