export abstract class ComponentInfo {
  abstract description: string;
  abstract previewContent: any;

  getDescription(): string {
    return this.description;
  }

  getPreviewContent(): any {
    return this.previewContent;
  }
}
