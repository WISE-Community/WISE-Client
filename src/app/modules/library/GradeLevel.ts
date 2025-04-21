export enum Grade {
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Eleven = 11,
  Twelve = 12
}

export class GradeLevel {
  id: Grade;
  grade: Grade;

  constructor(grade: Grade) {
    this.id = grade;
    this.grade = grade;
  }
}
