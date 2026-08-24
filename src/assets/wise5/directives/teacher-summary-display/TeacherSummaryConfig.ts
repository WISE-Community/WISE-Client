import { InjectionToken } from '@angular/core';

export interface TeacherSummaryConfig {
  anonymizeStudentNames: boolean;
}

export const TEACHER_SUMMARY_CONFIG = new InjectionToken<TeacherSummaryConfig>(
  'teacherSummaryConfig',
  {
    providedIn: 'root',
    factory: () => {
      return {
        anonymizeStudentNames: false
      };
    }
  }
);
