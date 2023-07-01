import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JigsawComponent } from './jigsaw.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatRadioModule } from '@angular/material/radio';
import { UpgradeModule } from '@angular/upgrade/static';

describe('JigsawComponent', () => {
  let component: JigsawComponent;
  let fixture: ComponentFixture<JigsawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JigsawComponent],
      imports: [HttpClientTestingModule, MatRadioModule, UpgradeModule]
    }).compileComponents();

    fixture = TestBed.createComponent(JigsawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
