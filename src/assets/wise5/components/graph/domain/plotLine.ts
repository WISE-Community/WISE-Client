export class PlotLine {
  color: string = 'red';
  id: string;
  label: { align: string; text: string; verticalAlign: string } = {
    align: '',
    text: '',
    verticalAlign: ''
  };
  value: number;
  width: number = 2;
  zIndex: number = 5;

  constructor(id: string, value: number, text: string) {
    this.id = id;
    this.label.text = text;
    this.value = value;
  }
}
