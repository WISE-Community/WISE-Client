export type StandardType = 'NGSS' | 'Common Core' | 'Learning For Justice';

export class Standard {
  id: string = '';
  name: string = '';
  type: StandardType;
  url: string = '';

  constructor(id: string = '', name: string = '', type: StandardType, url: string = '') {
    this.id = id;
    this.name = name;
    this.type = type;
    this.url = url;
  }
}
