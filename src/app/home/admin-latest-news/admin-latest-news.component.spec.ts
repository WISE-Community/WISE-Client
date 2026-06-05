import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLatestNewsComponent } from './admin-latest-news.component';

describe('AdminLatestNewsComponent', () => {
  let component: AdminLatestNewsComponent;
  let fixture: ComponentFixture<AdminLatestNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLatestNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLatestNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
