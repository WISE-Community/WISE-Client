import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private mobileMenuState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  getFirstName(fullName: string): string {
    return fullName.substring(0, fullName.indexOf(' '));
  }

  getLastName(fullName: string): string {
    return fullName.substring(fullName.indexOf(' ') + 1);
  }

  showMobileMenu(state: boolean = true): void {
    this.mobileMenuState$.next(state);
  }

  getMobileMenuState(): BehaviorSubject<boolean> {
    return this.mobileMenuState$;
  }

  removeObjectArrayDuplicatesByProperty(array: any[], prop: string): any[] {
    return array.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  sortObjectArrayByProperty(array: any[], prop: string): void {
    array.sort((a: any, b: any) => {
      const valA = a[prop].toLocaleLowerCase();
      const valB = b[prop].toLocaleLowerCase();
      if (valA < valB) {
        return -1;
      }
      if (valA > valB) {
        return 1;
      }
      return 0;
    });
  }

  sortByUsername(obj1: any, obj2: any) {
    const username1 = obj1.username.toLowerCase();
    const username2 = obj2.username.toLowerCase();
    if (username1 < username2) {
      return -1;
    } else if (username1 > username2) {
      return 1;
    } else {
      return 0;
    }
  }
}
