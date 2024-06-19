'use strict';

import { HttpClient } from '@angular/common/http';
import { Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Directive()
export abstract class ConfigureStructureComponent {
  protected groupsPath: string;
  protected nodesPath: string;
  protected target: string;
  private structure: any = {};
  private structureDir: string = 'assets/wise5/authoringTool/structure';
  protected submitting: boolean;

  constructor(
    private http: HttpClient,
    private projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.target = history.state.target;
    this.injectGroupAndNodes();
  }

  protected injectGroupAndNodes(): void {
    this.injectGroup();
    this.injectNodes();
  }

  protected injectGroup(): void {
    this.fetchGroups();
  }

  protected injectNodes(): void {
    this.fetchNodes();
  }

  protected fetchGroups(groupsPath: string = this.groupsPath): void {
    this.http.get(`${this.structureDir}/${groupsPath}`).subscribe((group: any) => {
      this.structure.group = group;
    });
  }

  protected fetchNodes(nodesPath: string = this.nodesPath): void {
    this.http.get(`${this.structureDir}/${nodesPath}`).subscribe((nodes: any[]) => {
      this.structure.nodes = nodes;
    });
  }

  protected chooseLocation(): void {
    this.router.navigate(['../location'], {
      relativeTo: this.route,
      state: { structure: this.structure }
    });
  }

  protected submit(): void {
    this.submitting = true;
    this.structure = this.injectUniqueIds(this.structure);
    this.addNodesToProject(this.structure.nodes);
    const target = history.state.target;
    if (target === 'group0' || target === 'inactiveGroups') {
      this.projectService.createNodeInside(this.structure.group, target);
    } else {
      this.projectService.createNodeAfter(this.structure.group, target);
    }
    this.saveAndGoBackToProjectHome();
  }

  private injectUniqueIds(structure: any): void {
    structure.group.id = this.projectService.getNextAvailableGroupId();
    const oldToNewIds = this.projectService.getOldToNewIds(structure.nodes);
    return this.projectService.replaceOldIds(structure, oldToNewIds);
  }

  private addNodesToProject(nodes: any[]): void {
    for (const node of nodes) {
      this.projectService.setIdToNode(node.id, node);
      this.projectService.addNode(node);
      this.projectService.applicationNodes.push(node);
    }
  }

  private saveAndGoBackToProjectHome(): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.router.navigate(['../../..'], { relativeTo: this.route });
    });
  }
}
