export interface TeacherPresentationItem {
  studentWorkId: number;
}

export type StudentNamesDisplayMode = 'show' | 'hide' | 'anonymize';

export interface TeacherPresentationConfig {
  id?: number;
  runId: number;
  periodId: number;
  nodeId: string;
  componentId: string;
  componentType: string;
  items: TeacherPresentationItem[];
  studentNamesDisplay: StudentNamesDisplayMode;
  prompt: string | null;
  updatedByWorkgroupId?: number;
  updatedAt?: number;
}
