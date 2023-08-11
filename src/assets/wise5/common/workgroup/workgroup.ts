export function getAvatarColorForWorkgroupId(workgroupId: number): string {
  const avatarColors = [
    '#E91E63',
    '#9C27B0',
    '#CDDC39',
    '#2196F3',
    '#FDD835',
    '#43A047',
    '#795548',
    '#EF6C00',
    '#C62828',
    '#607D8B'
  ];
  return avatarColors[workgroupId % 10];
}
