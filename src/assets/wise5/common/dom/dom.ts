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

/**
 * Apply JS-based masonry layout using 1px row height if CSS grid-lanes is not supported
 * @param grid The grid container element
 */
export function applyMasonry(grid: HTMLElement): void {
  if (!grid) return;
  const rowGap = parseInt(getComputedStyle(grid).rowGap) || 8;
  const rowHeight = 1;
  const items = Array.from(grid.children) as HTMLElement[];
  items.forEach((item) => {
    item.style.gridRowEnd = '';
    const contentHeight = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  });
  // Re-run when any images finish loading
  const pendingImages = Array.from(grid.querySelectorAll<HTMLImageElement>('img')).filter(
    (img) => !img.complete
  );
  pendingImages.forEach((img) => {
    img.addEventListener('load', () => applyMasonry(grid), { once: true });
    img.addEventListener('error', () => applyMasonry(grid), { once: true });
  });
}
