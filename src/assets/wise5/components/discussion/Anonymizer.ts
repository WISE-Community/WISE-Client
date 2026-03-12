/**
 * Generates an anonymous student name using a list of predefined names.
 * Maps a specific ID against a list of IDs to consistently assign a name based on its index.
 * If the number of IDs exceeds the available names, numeric suffixes are appended (e.g., "Student Tiger 1", "Student Tiger 2").
 */
export class Anonymizer {
  private nameOptions = [
    $localize`Tiger`,
    $localize`Lion`,
    $localize`Fox`,
    $localize`Owl`,
    $localize`Panda`,
    $localize`Hawk`,
    $localize`Mole`,
    $localize`Falcon`,
    $localize`Orca`,
    $localize`Eagle`,
    $localize`Manta`,
    $localize`Otter`,
    $localize`Cat`,
    $localize`Zebra`,
    $localize`Flea`,
    $localize`Wolf`,
    $localize`Dragon`,
    $localize`Seal`,
    $localize`Cobra`,
    $localize`Bug`,
    $localize`Gecko`,
    $localize`Fish`,
    $localize`Koala`,
    $localize`Mouse`,
    $localize`Wombat`,
    $localize`Shark`,
    $localize`Whale`,
    $localize`Sloth`,
    $localize`Slug`,
    $localize`Ant`,
    $localize`Mantis`,
    $localize`Bat`,
    $localize`Rhino`,
    $localize`Gator`,
    $localize`Monkey`,
    $localize`Swan`,
    $localize`Ray`,
    $localize`Crow`,
    $localize`Goat`,
    $localize`Marmot`,
    $localize`Dog`,
    $localize`Finch`,
    $localize`Puffin`,
    $localize`Fly`,
    $localize`Camel`,
    $localize`Kiwi`,
    $localize`Spider`,
    $localize`Lizard`,
    $localize`Robin`,
    $localize`Bear`,
    $localize`Boa`,
    $localize`Cow`,
    $localize`Crab`,
    $localize`Mule`,
    $localize`Moth`,
    $localize`Lynx`,
    $localize`Moose`,
    $localize`Skunk`,
    $localize`Mako`,
    $localize`Liger`,
    $localize`Llama`,
    $localize`Shrimp`,
    $localize`Parrot`,
    $localize`Pig`,
    $localize`Clam`,
    $localize`Urchin`,
    $localize`Toucan`,
    $localize`Frog`,
    $localize`Toad`,
    $localize`Turtle`,
    $localize`Viper`,
    $localize`Trout`,
    $localize`Hare`,
    $localize`Bee`,
    $localize`Krill`,
    $localize`Dodo`,
    $localize`Tuna`,
    $localize`Loon`,
    $localize`Leech`,
    $localize`Python`,
    $localize`Wasp`,
    $localize`Yak`,
    $localize`Snake`,
    $localize`Duck`,
    $localize`Worm`,
    $localize`Yeti`
  ];

  constructor(
    private id: number,
    private ids: number[]
  ) {}

  getName(prefix: string = $localize`Student`): string {
    let names = this.nameOptions;
    if (this.ids.length > this.nameOptions.length) {
      names = this.nameOptions.map((name) => name + ' ' + 1);
      let i = 2;
      while (this.ids.length > names.length) {
        names = names.concat(this.nameOptions.map((name) => name + ' ' + i));
        i++;
      }
    }
    return `${prefix} ${names.at(this.ids.indexOf(this.id))}`;
  }
}
