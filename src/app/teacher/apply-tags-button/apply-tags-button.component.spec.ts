import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyTagsButtonComponent } from './apply-tags-button.component';
import { ApplyTagsButtonModule } from './apply-tags-button.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApplyTagsButtonComponent', () => {
  let component: ApplyTagsButtonComponent;
  let fixture: ComponentFixture<ApplyTagsButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyTagsButtonComponent],
      imports: [ApplyTagsButtonModule, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ApplyTagsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
