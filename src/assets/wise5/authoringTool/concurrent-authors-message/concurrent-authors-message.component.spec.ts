import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentAuthorsMessageComponent } from './concurrent-authors-message.component';
import { ConfigService } from '../../services/configService';

class MockConfigService {
  getMyUsername(): string {
    return 'aa';
  }
}

let component: ConcurrentAuthorsMessageComponent;
let fixture: ComponentFixture<ConcurrentAuthorsMessageComponent>;
describe('ConcurrentAuthorsMessageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcurrentAuthorsMessageComponent],
      providers: [{ provide: ConfigService, useClass: MockConfigService }]
    });
    fixture = TestBed.createComponent(ConcurrentAuthorsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  ngOnChanges();
});

function ngOnChanges() {
  describe('ngOnChanges()', () => {
    it('should set empty message when there are no other authors', () => {
      expectMessage(['aa'], '');
    });
    it('should set message to other authors when there are no other authors', () => {
      expectMessage(
        ['aa', 'bb'],
        "bb is also currently editing this unit. Be careful not to overwrite each other's work!"
      );
    });
  });
}

function expectMessage(authors: string[], message: string) {
  component.authors = authors;
  component.ngOnChanges();
  expect(component.message).toEqual(message);
}
