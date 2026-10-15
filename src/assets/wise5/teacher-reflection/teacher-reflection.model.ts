export interface TeacherReflection {
  id?: number;
  runId: number;
  periodId: number;
  nodeId: string;
  componentId: string;
  componentType: string;
  questionId: string;
  questionText: string;
  answerText: string;
  answeredByWorkgroupId: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface TeacherReflectionAnswerRequest {
  runId: number;
  periodId: number;
  nodeId: string;
  componentId: string;
  componentType: string;
  questionId: string;
  questionText: string;
  answerText: string;
  answeredByWorkgroupId: number;
}
