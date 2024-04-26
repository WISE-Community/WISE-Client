import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyTagsButtonComponent } from './apply-tags-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';

describe('ApplyTagsButtonComponent', () => {
  let component: ApplyTagsButtonComponent;
  let fixture: ComponentFixture<ApplyTagsButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplyTagsButtonComponent, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [ProjectTagService]
    });
    fixture = TestBed.createComponent(ApplyTagsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
