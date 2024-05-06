import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedTagsListComponent } from './selected-tags-list.component';

describe('SelectedTagsListComponent', () => {
  let component: SelectedTagsListComponent;
  let fixture: ComponentFixture<SelectedTagsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectedTagsListComponent]
    });
    fixture = TestBed.createComponent(SelectedTagsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
