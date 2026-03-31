import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClassResponse } from '../class-response/class-response.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkTextareaAutosize,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SaveTimeMessageComponent,
    TextFieldModule
  ],
  selector: 'class-response-teacher',
  styleUrl: '../class-response/class-response.component.scss',
  templateUrl: './class-response-teacher.component.html'
})
export class ClassResponseTeacherComponent extends ClassResponse {
  @Output() deleteButtonClicked: any = new EventEmitter();
  protected expanded: boolean = false;
  @Input() isDisabled: boolean;
  @Input() mode: any;
  @Input() numReplies: number;
  protected repliesToShow: any[] = [];
  @Input() response: any;
  @Output() submitButtonClicked: any = new EventEmitter();
  @Output() undoDeleteButtonClicked: any = new EventEmitter();

  protected delete(componentState: any): void {
    if (confirm($localize`Are you sure you want to delete this post?`)) {
      this.deleteButtonClicked.emit(componentState);
    }
  }

  protected undoDelete(componentState: any): void {
    if (confirm($localize`Are you sure you want to show this post?`)) {
      this.undoDeleteButtonClicked.emit(componentState);
    }
  }
}
