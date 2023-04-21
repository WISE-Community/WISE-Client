export class PlotLine {
  color: string = 'red';
  id: string;
  label: { text: string; verticalAlign: string } = { text: '', verticalAlign: 'top' };
  value: number;
  width: number = 2;
  zIndex: number = 5;

  constructor(id: string, value: number, text: string) {
    this.id = id;
    this.label.text = text;
    this.value = value;
  }
}
