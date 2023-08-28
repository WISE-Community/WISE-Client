import { MatMenuHarness } from '@angular/material/menu/testing';

export async function clickMenuButton(thisContext: any, menuButtonText: string): Promise<void> {
  const getMenu = thisContext.locatorFor(MatMenuHarness);
  const menu = await getMenu();
  await menu.open();
  return menu.clickItem({ text: menuButtonText });
}
