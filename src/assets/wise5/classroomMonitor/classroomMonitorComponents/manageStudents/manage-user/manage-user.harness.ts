import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ShowStudentInfoHarness } from '../show-student-info/show-student-info.harness';

export class ManageUserHarness extends ComponentHarness {
  static hostSelector = 'manage-user';
  protected getStudentInfo = this.locatorForOptional(ShowStudentInfoHarness);
  protected getRemoveUserButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[aria-label="Remove student"]' })
  );

  async clickRemoveUserButton(): Promise<void> {
    (await this.getRemoveUserButton()).click();
  }

  async getUsername(): Promise<string> {
    return await (await this.getStudentInfo()).getUsernameText();
  }
}
