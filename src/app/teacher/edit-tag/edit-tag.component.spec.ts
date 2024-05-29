import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTagComponent } from './edit-tag.component';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditTagComponent', () => {
  let component: EditTagComponent;
  let fixture: ComponentFixture<EditTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, EditTagComponent, HttpClientTestingModule],
      providers: [ProjectTagService]
    });
    fixture = TestBed.createComponent(EditTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
