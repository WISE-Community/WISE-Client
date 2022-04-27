import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog.component';

describe('CreateNewPeerGroupingDialogComponent', () => {
  let component: CreateNewPeerGroupingDialogComponent;
  let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [CreateNewPeerGroupingDialogComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
