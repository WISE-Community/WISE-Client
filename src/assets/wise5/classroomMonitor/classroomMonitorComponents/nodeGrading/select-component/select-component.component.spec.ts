import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponentComponent } from './select-component.component';
import { Node } from '../../../../common/Node';

describe('SelectComponentComponent', () => {
  let component: SelectComponentComponent;
  let fixture: ComponentFixture<SelectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponentComponent);
    component = fixture.componentInstance;
    component.node = { components: [] } as Node;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
