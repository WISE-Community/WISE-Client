import { Injectable } from '@angular/core';

@Injectable()
export class ObjectService {
  copy(jsonObject: any): any {
    return this.isUndefined(jsonObject) ? undefined : JSON.parse(JSON.stringify(jsonObject));
  }

  private isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }
}
