export const NODE_ICON_COLORS = [
  '#66BB6A',
  '#009688',
  '#00B0FF',
  '#1565C0',
  '#673AB7',
  '#AB47BC',
  '#E91E63',
  '#D50000',
  '#F57C00',
  '#FBC02D',
  '#795548',
  '#757575'
];

export function getRandomNodeIconColor(): string {
  return NODE_ICON_COLORS[Math.floor(Math.random() * NODE_ICON_COLORS.length)];
}
