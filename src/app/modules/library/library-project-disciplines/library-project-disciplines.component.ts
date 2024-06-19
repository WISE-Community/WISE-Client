import { Component, Input, OnInit } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-library-project-disciplines',
  templateUrl: './library-project-disciplines.component.html',
  styleUrl: './library-project-disciplines.component.scss',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatTooltipModule]
})
export class LibraryProjectDisciplinesComponent implements OnInit {
  protected disciplines: any[];
  @Input() project: LibraryProject = new LibraryProject();

  ngOnInit(): void {
    let standards = this.project.metadata.standardsAddressed;
    if (standards && standards.ngss) {
      if (standards.ngss.disciplines) {
        // load NGSS disciplines from project metadata
        this.disciplines = standards.ngss.disciplines;
        for (let discipline of this.disciplines) {
          // default color
          discipline.color = '#000000';

          // assign color based on discipline id
          if (discipline.id) {
            switch (discipline.id) {
              case 'ESS':
                discipline.color = '#2E7D32';
                break;
              case 'ETS':
                discipline.color = '#1565C0';
                break;
              case 'LS':
                discipline.color = '#D81B60';
                break;
              case 'PS':
                discipline.color = '#8E24AA';
                break;
            }
          }
        }
      }
    }
  }
}
