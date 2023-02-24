export class UserIdsAndStudentNames extends Map<string, any> {
  constructor(users: any[], canViewStudentNames: boolean) {
    super();
    for (let u = 0; u < users.length; u++) {
      const user = users[u];
      this.set(`userId${u + 1}`, user.id);
      if (canViewStudentNames) {
        this.set(`studentName${u + 1}`, user.name);
      }
    }
  }

  getUserId(userNumber: number): number {
    return this.get(`userId${userNumber}`);
  }

  getStudentName(userNumber: number): string {
    return this.get(`studentName${userNumber}`);
  }
}
