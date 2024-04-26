import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsFilterComponent } from './tags-filter.component';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TagsFilterComponent', () => {
  let component: TagsFilterComponent;
  let fixture: ComponentFixture<TagsFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, TagsFilterComponent],
      providers: [ProjectTagService]
    });
    fixture = TestBed.createComponent(TagsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
