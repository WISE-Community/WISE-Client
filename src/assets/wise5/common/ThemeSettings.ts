export class ThemeSettings {
  hidePossibleScores?: boolean = false;
  showComponentTitles?: boolean = true;
  showComponentTypeIcons?: boolean = true;

  constructor(init?: Partial<ThemeSettings>) {
    Object.assign(this, init);
  }
}
