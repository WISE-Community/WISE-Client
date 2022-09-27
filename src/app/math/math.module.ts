import { NgModule } from '@angular/core';
import { MathService } from './math.service';

@NgModule({
  providers: [MathService]
})
export class MathModule {
  constructor(mathService: MathService) {
    mathService.ready();
  }
}
