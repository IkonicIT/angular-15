import { Component, OnInit } from '@angular/core';
import { CompanyTypesService } from '../../../services/index';

import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';

@Component({
  selector: 'app-editcompanyattributes',
  templateUrl: './editcompanyattributes.component.html',
  styleUrls: ['./editcompanyattributes.component.scss'],
})
export class EditcompanyattributesComponent implements OnInit {
  model: any = {};
  index: number = 0;
  p: any;
  statuses: any = [];
  companyId: number = 0;
  documentId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  dismissible: boolean = true;

  constructor(
    private companyTypesService: CompanyTypesService,
    router: Router,
    private route: ActivatedRoute
  ) {
    this.companyId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.documentId = +params['a'] || 0;
      console.log('Query params ', this.documentId);
    });
  }

  updateCompanyType() {
    if (this.model.nameOfType === undefined || this.model.nameOfType === '') {
      this.index = -1;
    } else {
    }
  }
}
