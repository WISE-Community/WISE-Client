'use strict';

import { Injectable } from '@angular/core';
import '../lib/jquery/jquery-global';

@Injectable()
export class UtilService {
  constructor() {}
}

declare global {
  interface Array<T> {
    last(): T;
  }
}
// extend array prototype with a last() method
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
