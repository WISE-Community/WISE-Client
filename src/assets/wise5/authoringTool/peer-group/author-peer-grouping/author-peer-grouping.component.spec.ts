import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPeerGroupingComponent } from './author-peer-grouping.component';

describe('AuthorPeerGroupingComponent', () => {
  let component: AuthorPeerGroupingComponent;
  let fixture: ComponentFixture<AuthorPeerGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorPeerGroupingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPeerGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
