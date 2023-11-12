export abstract class ComponentInfo {
  protected abstract description: string;
  protected abstract label: string;
  protected abstract previewContent: any;

  getDescription(): string {
    return this.description;
  }

  getLabel(): string {
    return this.label;
  }

  getPreviewContent(): any {
    return this.previewContent;
  }
}
