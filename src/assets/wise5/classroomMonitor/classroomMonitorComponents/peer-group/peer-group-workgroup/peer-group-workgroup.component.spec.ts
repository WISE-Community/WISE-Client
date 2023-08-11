import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { PeerGroupWorkgroupComponent } from './peer-group-workgroup.component';

describe('PeerGroupWorkgroupComponent', () => {
  let component: PeerGroupWorkgroupComponent;
  let fixture: ComponentFixture<PeerGroupWorkgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PeerGroupWorkgroupComponent],
      providers: [ConfigService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupWorkgroupComponent);
    component = fixture.componentInstance;
    component.workgroup = { username: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
