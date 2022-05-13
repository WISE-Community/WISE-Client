export class PeerGrouping {
  logic: string;
  maxMembershipCount: number;
  name: string;
  stepsUsedIn: string[];
  tag: string;
  threshold: any[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}
