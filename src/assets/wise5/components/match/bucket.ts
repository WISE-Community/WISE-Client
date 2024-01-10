import { Choice } from './choice';

export class Bucket {
  id: string;
  items?: Choice[];
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}
