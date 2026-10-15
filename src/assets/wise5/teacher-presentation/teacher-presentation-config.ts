export type TeacherPresentationItemType = 'Discussion' | 'Ideas';

export interface DiscussionPresentationItem {
  studentWorkId: number;
}

/**
 * A single selected student response. Dialog Guidance work is additive (each save contains the
 * whole chat), so a response is identified by its workgroup and message timestamp rather than by
 * studentWorkId, which changes with every save. The text is stored as a snapshot so the response
 * can be presented without re-loading student work.
 */
export interface IdeasPresentationResponse {
  studentWorkId: number;
  workgroupId: number;
  responseTimestamp: number | null;
  text: string;
}

export interface IdeasPresentationItem {
  ideaId: string | null;
  responses: IdeasPresentationResponse[];
}

export type TeacherPresentationItem = DiscussionPresentationItem | IdeasPresentationItem;

export function getIdeasResponseKey(response: IdeasPresentationResponse): string {
  return response.responseTimestamp != null
    ? `${response.workgroupId}:${response.responseTimestamp}`
    : `sw:${response.studentWorkId}`;
}

export type StudentNamesDisplayMode = 'show' | 'hide' | 'anonymize';

export interface TeacherPresentationConfig {
  id?: number;
  runId: number;
  periodId: number;
  nodeId: string;
  componentId: string;
  componentType: string;
  itemType?: TeacherPresentationItemType;
  items: TeacherPresentationItem[];
  studentNamesDisplay: StudentNamesDisplayMode;
  prompt: string | null;
  updatedByWorkgroupId?: number;
  updatedAt?: number;
}
