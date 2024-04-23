export class ComputerAvatar {
  id: string;
  image: string;
  isSelected: boolean;
  name: string;

  constructor(id: string, name: string, image: string) {
    this.id = id;
    this.image = image;
    this.name = name;
  }
}
