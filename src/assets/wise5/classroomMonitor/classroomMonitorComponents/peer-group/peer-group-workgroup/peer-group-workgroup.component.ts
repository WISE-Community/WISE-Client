import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'peer-group-workgroup',
  templateUrl: './peer-group-workgroup.component.html',
  styleUrls: ['./peer-group-workgroup.component.scss']
})
export class PeerGroupWorkgroupComponent implements OnInit {
  @Input() workgroup: any;

  workgroupUsernames: string;

  constructor() {}

  ngOnInit(): void {
    this.workgroupUsernames = this.workgroup.username.replace(/:/g, ' and ');
  }
}
