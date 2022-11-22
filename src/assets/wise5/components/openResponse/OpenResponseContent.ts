import { ComponentContent } from '../../common/ComponentContent';

export interface OpenResponseContent extends ComponentContent {
  completionCriteria: any;
  cRater: any;
  enableCRater: boolean;
  enableNotifications: boolean;
  isStudentAudioRecordingEnabled: boolean;
  maxSubmitCount?: number;
  notificationSettings: any;
  starterSentence: any;
}
