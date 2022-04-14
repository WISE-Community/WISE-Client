import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAndContentComponent } from './title-and-content.component';

describe('TitleAndContentComponent', () => {
  let component: TitleAndContentComponent;
  let fixture: ComponentFixture<TitleAndContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleAndContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleAndContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
