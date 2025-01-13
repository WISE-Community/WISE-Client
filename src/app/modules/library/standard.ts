export class Standard {
  id: string = '';
  name: string = '';
  children: Standard[] = [];
}

export type ResearchProjectTypes = 'ARISE' | 'NLP-TIPS';

export class ResearchProject extends Standard {
  name: ResearchProjectTypes;
}
