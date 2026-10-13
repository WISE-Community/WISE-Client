import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LibraryProject } from '../libraryProject';

const DISCIPLINE_COLORS: Record<string, string> = {
  ESS: '#2E7D32',
  ETS: '#1565C0',
  LS: '#D81B60',
  Math: '#444444',
  PS: '#8E24AA',
  SJ: '#F57C00'
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltipModule],
  selector: 'app-library-project-disciplines',
  styleUrl: './library-project-disciplines.component.scss',
  templateUrl: './library-project-disciplines.component.html'
})
export class LibraryProjectDisciplinesComponent {
  readonly project = input<LibraryProject>(new LibraryProject());

  protected readonly disciplines = computed(() => {
    const list = this.project().metadata?.disciplines;
    if (!list?.length) {
      return [];
    }
    return list.map((discipline: any) => ({
      ...discipline,
      color: DISCIPLINE_COLORS[discipline.id] ?? '#000000'
    }));
  });
}
