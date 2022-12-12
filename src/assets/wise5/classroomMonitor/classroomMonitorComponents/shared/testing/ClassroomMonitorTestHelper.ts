export class ClassroomMonitorTestHelper {
  workgroupId1: number = 1;
  workgroupId2: number = 2;
  workgroupId3: number = 3;
  workgroupId4: number = 4;
  workgroupId5: number = 5;

  expectWorkgroupOrder(workgroups: any[], expectedWorkgroupIdOrder: number[]): void {
    for (let w = 0; w < workgroups.length; w++) {
      expect(workgroups[w].workgroupId).toEqual(expectedWorkgroupIdOrder[w]);
    }
  }
}
