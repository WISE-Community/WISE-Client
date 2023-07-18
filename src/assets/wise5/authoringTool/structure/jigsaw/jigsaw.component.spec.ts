import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JigsawComponent } from './jigsaw.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatRadioModule } from '@angular/material/radio';
import { UpgradeModule } from '@angular/upgrade/static';
import { FormsModule } from '@angular/forms';

describe('JigsawComponent', () => {
  let component: JigsawComponent;
  let fixture: ComponentFixture<JigsawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JigsawComponent],
      imports: [FormsModule, HttpClientTestingModule, MatRadioModule, UpgradeModule]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(JigsawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
