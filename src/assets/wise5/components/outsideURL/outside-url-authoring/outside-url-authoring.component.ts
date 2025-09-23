import { CommonModule, NgStyle } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { OutsideURLService } from '../outsideURLService';

@Component({
  selector: 'outside-url-authoring',
  templateUrl: 'outside-url-authoring.component.html',
  styleUrl: 'outside-url-authoring.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSlideToggle,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInput,
    MatTooltip,
    MatIcon,
    MatCard,
    NgStyle,
    MatCardTitle,
    MatCardActions,
    TranslatableInputComponent
  ]
})
export class OutsideUrlAuthoring extends AbstractComponentAuthoring {
  isShowOERs: boolean;
  allOpenEducationalResources: any[];
  filteredOpenEducationalResources: any[];
  subjects: any[] = [
    {
      value: 'Earth and Space Sciences',
      label: $localize`Earth and Space Sciences`
    },
    {
      value: 'Life Sciences',
      label: $localize`Life Sciences`
    },
    {
      value: 'Physical Sciences',
      label: $localize`Physical Sciences`
    },
    {
      value: 'Engineering, Technology, and Applications of Science',
      label: $localize`Engineering, Technology, and Applications of Science`
    }
  ];
  searchText: string;
  selectedSubjects: any[];
  urlChange: Subject<string> = new Subject<string>();
  widthChange: Subject<string> = new Subject<string>();
  heightChange: Subject<string> = new Subject<string>();

  constructor(
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected outsideURLService: OutsideURLService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isShowOERs = this.componentContent.url === '';
    this.searchText = '';
    this.selectedSubjects = [];
    this.outsideURLService.getOpenEducationalResources().then((openEducationalResources: any) => {
      this.allOpenEducationalResources = openEducationalResources.sort((a, b) =>
        a.metadata.title.localeCompare(b.metadata.title)
      );
      this.filteredOpenEducationalResources = this.allOpenEducationalResources;
    });
    this.subscriptions.add(
      this.urlChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((url: string) => {
        this.componentContent.url = url;
        this.componentContent.info = null;
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.widthChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.heightChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  chooseOpenEducationalResource(openEducationalResource: any): void {
    this.componentContent.url = openEducationalResource.url;
    this.componentContent.info = openEducationalResource.info;
    this.componentChanged();
  }

  isResourceSelected(resourceUrl: string): boolean {
    return resourceUrl === this.componentContent.url;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSubjects = [];
    this.searchFieldChanged();
  }

  searchFieldChanged(): void {
    this.filteredOpenEducationalResources = this.allOpenEducationalResources.filter((oer) => {
      const isSearchTextFound = this.isSearchTextFound(this.searchText, JSON.stringify(oer));
      if (this.isAnySubjectChosen()) {
        return isSearchTextFound && this.isSubjectFound(this.selectedSubjects, oer);
      }
      return isSearchTextFound;
    });
  }

  isSearchTextFound(searchText: string, testText: string): boolean {
    return testText.toLowerCase().includes(searchText.toLowerCase());
  }

  isAnySubjectChosen(): boolean {
    return this.selectedSubjects.length > 0;
  }

  isSubjectFound(selectedSubjects: any[], resource: any): boolean {
    for (const subject of selectedSubjects) {
      if (resource.metadata.subjects.includes(subject)) {
        return true;
      }
    }
    return false;
  }
}
