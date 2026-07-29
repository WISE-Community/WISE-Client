import { ComponentContent } from '../../common/ComponentContent';

export interface OpenResponseContent extends ComponentContent {
  backgroundColor?: string;
  completionCriteria: any;
  cRater: any;
  context?: string;
  enableCRater: boolean;
  enableNotifications: boolean;
  isStudentAudioRecordingEnabled: boolean;
  maxSubmitCount?: number;
  notificationSettings: any;
  starterSentence: any;
}
