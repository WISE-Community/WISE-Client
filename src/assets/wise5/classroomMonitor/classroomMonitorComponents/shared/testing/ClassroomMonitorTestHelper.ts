import { StudentProgress } from '../../../student-progress/student-progress.component';

export class ClassroomMonitorTestHelper {
  workgroupId1: number = 1;
  workgroupId2: number = 2;
  workgroupId3: number = 3;
  workgroupId4: number = 4;
  workgroupId5: number = 5;

  students: StudentProgress[] = [
    new StudentProgress({
      location: '1.2: Open Response',
      workgroupId: this.workgroupId1,
      username: 'Spongebob Squarepants',
      firstName: 'Spongebob',
      lastName: 'Squarepants',
      completionPct: 30,
      scorePct: 0.8
    }),
    new StudentProgress({
      location: '1.1: Open Response',
      workgroupId: this.workgroupId5,
      username: 'Patrick Star',
      firstName: 'Patrick',
      lastName: 'Star',
      completionPct: 10,
      scorePct: 0.6
    }),
    new StudentProgress({
      location: '1.5: Open Response',
      workgroupId: this.workgroupId3,
      username: 'Squidward Tentacles',
      firstName: 'Squidward',
      lastName: 'Tentacles',
      completionPct: 20,
      scorePct: 0.4
    }),
    new StudentProgress({
      location: '1.9: Open Response',
      workgroupId: this.workgroupId2,
      username: 'Sandy Cheeks',
      firstName: 'Sandy',
      lastName: 'Cheeks',
      completionPct: 50,
      scorePct: 0.8
    }),
    new StudentProgress({
      location: '1.5: Open Response',
      workgroupId: this.workgroupId4,
      username: 'Sheldon Plankton',
      firstName: 'Sheldon',
      lastName: 'Plankton',
      completionPct: 20,
      scorePct: 0.8
    })
  ];

  expectWorkgroupOrder(workgroups: any[], expectedWorkgroupIdOrder: number[]): void {
    for (let w = 0; w < workgroups.length; w++) {
      expect(workgroups[w].workgroupId).toEqual(expectedWorkgroupIdOrder[w]);
    }
  }
}
