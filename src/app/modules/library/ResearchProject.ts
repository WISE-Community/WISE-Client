export type ResearchProjectType = 'ARISE' | 'NLP-TIPS';

export class ResearchProject {
  name: ResearchProjectType;

  constructor(name: ResearchProjectType) {
    this.name = name;
  }
}
