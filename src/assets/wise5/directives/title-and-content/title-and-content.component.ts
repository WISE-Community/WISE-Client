import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'title-and-content',
  templateUrl: './title-and-content.component.html',
  styleUrls: ['./title-and-content.component.scss']
})
export class TitleAndContentComponent implements OnInit {
  @Input()
  content: string;

  @Input()
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
