import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleAndContentComponent } from './title-and-content.component';

describe('TitleAndContentComponent', () => {
  let component: TitleAndContentComponent;
  const content = 'My Content';
  let fixture: ComponentFixture<TitleAndContentComponent>;
  let hostElement: HTMLElement;
  const title = 'My Title';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleAndContentComponent]
    });
    fixture = TestBed.createComponent(TitleAndContentComponent);
    component = fixture.componentInstance;
    component.title = title;
    component.content = content;
    fixture.detectChanges();
    hostElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    expect(hostElement.querySelector('.title').innerHTML).toEqual(title);
  });

  it('should display content', () => {
    expect(hostElement.querySelector('.content').innerHTML).toEqual(content);
  });
});
