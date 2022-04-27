import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';

describe('SelectPeerGroupingDialogComponent', () => {
  let component: SelectPeerGroupingDialogComponent;
  let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [SelectPeerGroupingDialogComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGroupingSettings').and.returnValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
