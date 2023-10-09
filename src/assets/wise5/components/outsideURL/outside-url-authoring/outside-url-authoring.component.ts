import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { OutsideURLService } from '../outsideURLService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'outside-url-authoring',
  templateUrl: 'outside-url-authoring.component.html',
  styleUrls: ['outside-url-authoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OutsideUrlAuthoring extends AbstractComponentAuthoring {
  isShowOERs: boolean;
  allOpenEducationalResources: any[];
  filteredOpenEducationalResources: any[];
  outsideURLIFrameId: string;
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
    protected ConfigService: ConfigService,
    protected NodeService: TeacherNodeService,
    protected OutsideURLService: OutsideURLService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.outsideURLIFrameId = 'outsideResource_' + this.componentId;
    this.isShowOERs = this.componentContent.url === '';
    this.searchText = '';
    this.selectedSubjects = [];
    this.OutsideURLService.getOpenEducationalResources().then((openEducationalResources: any) => {
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

  reloadResource(): void {
    const iframe: any = document.getElementById(this.outsideURLIFrameId);
    iframe.src = '';
    iframe.src = this.componentContent.url;
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
