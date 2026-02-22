import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { PeerGroupWorkgroupComponent } from './peer-group-workgroup.component';
import { provideHttpClient } from '@angular/common/http';

describe('PeerGroupWorkgroupComponent', () => {
  let component: PeerGroupWorkgroupComponent;
  let fixture: ComponentFixture<PeerGroupWorkgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupWorkgroupComponent],
      providers: [ConfigService, provideHttpClient()]
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
