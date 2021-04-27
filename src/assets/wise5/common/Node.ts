export class Node {
  icons: any;
  icon: any;
  id: string;
  title: string;
  type: string;

  getIcon(): any {
    if (this.icon == null) {
      this.setIcon();
    }
    return this.icon;
  }

  setIcon(): void {
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
    this.icon = icon;
  }

  isGroup(): boolean {
    return this.type === 'group';
  }
}
