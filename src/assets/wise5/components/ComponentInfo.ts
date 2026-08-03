export abstract class ComponentInfo {
  protected abstract description: string;
  protected abstract icon: string;
  protected abstract label: string;
  protected abstract previewExamples: any[];

  getDescription(): string {
    return this.description;
  }

  getLabel(): string {
    return this.label;
  }

  getIcon(): string {
    return this.icon;
  }

  getPreviewExamples(): any[] {
    return this.previewExamples;
  }
}
