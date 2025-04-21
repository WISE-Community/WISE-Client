import { Component, Input, OnInit } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-library-project-disciplines',
  templateUrl: './library-project-disciplines.component.html',
  styleUrl: './library-project-disciplines.component.scss',
  imports: [CommonModule, MatTooltipModule]
})
export class LibraryProjectDisciplinesComponent implements OnInit {
  protected disciplines: any[];
  @Input() project: LibraryProject = new LibraryProject();

  ngOnInit(): void {
    if (this.project.metadata.disciplines?.length) {
      this.disciplines = this.project.metadata.disciplines;
      const colors = {
        ESS: '#2E7D32',
        ETS: '#1565C0',
        LS: '#D81B60',
        PS: '#8E24AA'
      };
      this.disciplines.forEach((discipline) => {
        discipline.color = colors[discipline.id] ?? '#000000';
      });
    }
  }
}
