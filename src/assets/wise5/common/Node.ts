export class Node {
  icons: any;
  id: string;
  title: string;
  type: string;

  getIcon(): any {
    const defaultIcon = {
      color: 'rgba(0,0,0,0.54)',
      type: 'font',
      fontSet: 'material-icons',
      fontName: this.type === 'group' ? 'explore' : 'school',
      imgSrc: '',
      imgAlt: 'node icon'
    };
    let icon;
    if (this.icons != null && this.icons.default != null) {
      icon = $.extend(true, defaultIcon, this.icons.default);
    } else {
      icon = defaultIcon;
    }
    if (!icon.imgSrc) {
      icon.type = 'font';
    }
    return icon;
  }
}
