import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-password-and-confirm',
  templateUrl: './new-password-and-confirm.component.html',
  styleUrls: ['./new-password-and-confirm.component.scss']
})
export class NewPasswordAndConfirmComponent implements OnInit {
  @Input() confirmPasswordLabel: string = $localize`Confirm New Password`;
  @Input() formGroup: FormGroup;
  @Input() passwordLabel: string = $localize`New Password`;

  constructor() {}

  ngOnInit(): void {}
}
