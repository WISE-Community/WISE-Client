import { ComponentHarness } from '@angular/cdk/testing';
import { ManageUserHarness } from '../manage-user/manage-user.harness';

export class ManageTeamHarness extends ComponentHarness {
  static hostSelector = 'manage-team';
  protected getChangePeriodLink = this.locatorForOptional('.change-period');
  protected getMembers = this.locatorForAll(ManageUserHarness);

  async isChangePeriodLinkVisible(): Promise<boolean> {
    return (await this.getChangePeriodLink()) != null;
  }

  async getMember(username: string): Promise<ManageUserHarness> {
    for (const member of await this.getMembers()) {
      if ((await member.getUsername()) === username) {
        return member;
      }
    }
    return null;
  }

  async clickRemoveUser(username: string): Promise<void> {
    const member = await this.getMember(username);
    await member.clickRemoveUserButton();
  }

  async getMemberCount(): Promise<number> {
    return (await this.getMembers()).length;
  }
}
