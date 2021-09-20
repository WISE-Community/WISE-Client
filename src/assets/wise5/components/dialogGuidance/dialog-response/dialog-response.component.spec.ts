import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../services/configService';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from './dialog-response.component';

describe('DialogResponseComponent', () => {
  let component: DialogResponseComponent;
  let fixture: ComponentFixture<DialogResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexLayoutModule, HttpClientTestingModule, MatIconModule, UpgradeModule],
      declarations: [DialogResponseComponent],
      providers: [ConfigService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponseComponent);
    component = fixture.componentInstance;
    component.response = new DialogResponse('Hello World', new Date().getTime(), 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
