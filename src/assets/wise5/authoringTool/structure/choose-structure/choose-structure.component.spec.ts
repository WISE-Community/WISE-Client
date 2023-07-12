import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseStructureComponent } from './choose-structure.component';
import { UpgradeModule } from '@angular/upgrade/static';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('ChooseStructureComponent', () => {
  let component: ChooseStructureComponent;
  let fixture: ComponentFixture<ChooseStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseStructureComponent],
      imports: [MatCardModule, MatIconModule, UpgradeModule]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(ChooseStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
