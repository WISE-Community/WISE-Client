import { ComponentHarness } from '@angular/cdk/testing';

export class LibraryProjectHarness extends ComponentHarness {
  static hostSelector = 'app-library-project';

  async getProjectId(): Promise<number> {
    const getProjectCaption = this.locatorFor('.mat-caption');
    const caption = await getProjectCaption();
    const text = await caption.text();
    return this.extractIdNumber(text);
  }

  private extractIdNumber(captionText: string): number {
    const result = captionText.match(/\(ID: (\d)\)/);
    return parseInt(result[1]);
  }
}
