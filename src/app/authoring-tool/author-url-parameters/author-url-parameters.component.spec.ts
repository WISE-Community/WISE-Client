import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorUrlParametersComponent } from './author-url-parameters.component';

describe('AuthorUrlParametersComponent', () => {
  let component: AuthorUrlParametersComponent;
  let fixture: ComponentFixture<AuthorUrlParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorUrlParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorUrlParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
