import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';

describe('EditPeerGroupingDialogComponent', () => {
  let component: EditPeerGroupingDialogComponent;
  let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [EditPeerGroupingDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            settings: {},
            stepsUsedIn: []
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
