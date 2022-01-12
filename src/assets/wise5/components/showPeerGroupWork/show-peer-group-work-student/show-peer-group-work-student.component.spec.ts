import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPeerGroupWorkStudentComponent } from './show-peer-group-work-student.component';

describe('ShowPeerGroupWorkStudentComponent', () => {
  let component: ShowPeerGroupWorkStudentComponent;
  let fixture: ComponentFixture<ShowPeerGroupWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPeerGroupWorkStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPeerGroupWorkStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
