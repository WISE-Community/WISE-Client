export class CRaterIdea {
  name: string;
  detected: boolean;
  characterOffsets: any[];
  studentText?: string;
  teacherText?: string;

  constructor(name: string, detected: boolean) {
    this.name = name;
    this.detected = detected;
  }
}
