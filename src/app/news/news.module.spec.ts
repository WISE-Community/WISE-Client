import { NewsModule } from './news.module';
import { TestBed } from '@angular/core/testing';

describe('NewsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewsModule]
    });
  });

  it('initializes', () => {
    const module = TestBed.inject(NewsModule);
    expect(module).toBeTruthy();
  });
});
