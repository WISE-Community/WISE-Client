import { ComponentHarness } from '@angular/cdk/testing';

export class ShowStudentInfoHarness extends ComponentHarness {
  static hostSelector = 'show-student-info';
  protected getUsername = this.locatorFor('.username');

  async getUsernameText(): Promise<string> {
    return (await this.getUsername()).text();
  }
}
