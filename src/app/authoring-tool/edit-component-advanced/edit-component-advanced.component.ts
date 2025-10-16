import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  Inject,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { components } from '../../../assets/wise5/components/Components';

@Component({
  imports: [MatDivider, MatDialogModule, MatButtonModule],
  styles: [
    '.mat-divider { margin: 0 -16px; } .mat-mdc-dialog-content { padding-top: 10px !important; padding-bottom: 10px !important; }'
  ],
  templateUrl: './edit-component-advanced.component.html'
})
export class EditComponentAdvancedComponent {
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  constructor(
    private applicationRef: ApplicationRef,
    @Inject(MAT_DIALOG_DATA) protected component: WISEComponent,
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
