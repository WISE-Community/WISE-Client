import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  Inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { components } from '../../../assets/wise5/components/Components';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatDivider, MatDialogModule, MatButtonModule],
  styles: [
    `
      .edit-component-advanced {
        --mat-tab-divider-color: var(--mat-divider-color);
        --mat-tab-divider-height: 1px;
        .mat-divider {
          margin: 0 -16px;
        }
        .mat-mdc-tab-body-content {
          padding: 16px 0;
        }
        .mat-mdc-tab-header {
          position: sticky;
          top: 0;
          z-index: 2;
          background-color: white;
          margin: 0 -16px;
        }
      }
    `
  ],
  templateUrl: './edit-component-advanced.component.html'
})
export class EditComponentAdvancedComponent {
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  constructor(
    private applicationRef: ApplicationRef,
    @Inject(MAT_DIALOG_DATA) protected data: { component: WISEComponent; tab?: string },
    private injector: EnvironmentInjector
  ) {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(
      components[this.data.component.content.type].authoringAdvanced,
      {
        hostElement: this.componentElementRef.nativeElement,
        environmentInjector: this.injector
      }
    );
    Object.assign(this.componentRef.instance, {
      nodeId: this.data.component.nodeId,
      componentId: this.data.component.id,
      tab: this.data.tab
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }
}
