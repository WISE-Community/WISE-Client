import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { LibraryGroup } from '../libraryGroup';

@Component({
  selector: 'app-library-group-thumbs',
  styleUrl: './library-group-thumbs.component.scss',
  templateUrl: './library-group-thumbs.component.html'
})
export class LibraryGroupThumbsComponent implements OnInit {
  protected children: Array<any> = [];
  @Input() group: LibraryGroup = new LibraryGroup();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.children = this.group.children;
    this.children
      .filter((project) => project.type === 'project')
      .forEach((project) => (project.thumbStyle = this.getThumbStyle(project.projectThumb)));
  }

  /**
   * Returns the background-image css value for project thumbnail
   * @param {string} projectThumb
   * @returns {SafeStyle}
   */
  private getThumbStyle(projectThumb: string): SafeStyle {
    const DEFAULT_THUMB = 'assets/img/default-picture.svg';
    const STYLE = `url(${projectThumb}), url(${DEFAULT_THUMB})`;
    return this.sanitizer.bypassSecurityTrustStyle(STYLE);
  }
}
