import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { components } from '../../../assets/wise5/components/Components';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule, MatButtonModule],
  selector: 'edit-component-advanced',
  styles: [
    `
      .edit-component-advanced {
        --mat-tab-divider-color: var(--mat-divider-color);
        --mat-tab-divider-height: 1px;
        height: 100%;
        .mat-mdc-tab-group,
        .mat-mdc-tab-body-wrapper {
          height: 100%;
        }
        .mat-mdc-tab-body-content {
          padding: 16px;
        }
        .mat-mdc-tab-header {
          position: sticky;
          top: 0;
          z-index: 2;
          background-color: white;
        }
      }
    `
  ],
  template: '<div class="edit-component-advanced" #component></div>'
})
export class EditComponentAdvancedComponent {
  @Input() component: WISEComponent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  constructor(
    private applicationRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(components[this.component.content.type].authoringAdvanced, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      nodeId: this.component.nodeId,
      componentId: this.component.id
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }
}
