export class Node {
  components: any[] = [];
  icons: any;
  icon: any;
  id: string;
  rubric: any;
  showSaveButton: boolean;
  showSubmitButton: boolean;
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
      color: '#757575',
      type: 'font',
      fontSet: 'material-icons',
      fontName: this.type === 'group' ? 'explore' : 'school',
      imgSrc: ''
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

  getNodeIdComponentIds(): any {
    return this.components.map((component) => {
      return { nodeId: this.id, componentId: component.id };
    });
  }

  getComponent(componentId: string): any {
    return this.components.find((component) => component.id === componentId);
  }

  hasComponent(componentId: string): boolean {
    return this.components.some((component) => component.id === componentId);
  }
}
