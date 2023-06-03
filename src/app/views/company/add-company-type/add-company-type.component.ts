import { Component, OnInit } from '@angular/core';
import { CompanyTypesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-add-company-type',
  templateUrl: './add-company-type.component.html',
  styleUrls: ['./add-company-type.component.scss'],
})
export class AddCompanyTypeComponent implements OnInit {
  model: any = {
    parentType: 0,
  };
  index: any = 0;
  date = Date.now();
  companyId: any = 0;
  private sub: any;
  id: any;
  router: Router;
  cmpTypes: any[] = [];
  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  helpFlag: any = false;

  constructor(
    private companyTypesService: CompanyTypesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });
    this.getAllTypes(this.companyId);
    console.log('companyi=' + this.companyId);
  }

  getAllTypes(companyId: string | number) {
    this.spinner.show();
    this.companyTypesService
      .getAllCompanyTypesWithHierarchy(companyId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.cmpTypes = response;
          var self = this;
          if (this.cmpTypes && this.cmpTypes.length > 0) {
            self.items = [];
            self.items = self.generateHierarchy(this.cmpTypes);
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  generateHierarchy(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  saveCompanyType() {
    if (this.model.nameOfType === undefined) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model.by = this.userName;
      this.model.added = this.date;
      var request = {
        attributesearchdisplay: 0,
        company: {
          companyid: this.companyId,
        },
        description: this.model.description,
        entitytypeid: 0,
        hostingfee: this.model.hostingFee ? this.model.hostingFee : 0,
        ishidden: true,
        lastmodifiedby: this.userName,
        moduleType: 'companytype',
        name: this.model.nameOfType,
        parentid: {
          typeid: this.value ? this.value : 0,
        },
        typeid: 0,
        typemtbs: 0,
        typespareratio: 0,
      };
      this.spinner.show();
      console.log(JSON.stringify(request));
      this.companyTypesService.saveCompanyType(request).subscribe(
        (response) => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.router.navigate(['/company/types/' + this.companyId]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  onValueChange(value: any) {
    console.log(value);
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/types/' + this.companyId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
