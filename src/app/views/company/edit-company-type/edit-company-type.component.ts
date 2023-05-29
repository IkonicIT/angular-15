import { Component, OnInit } from '@angular/core';
import { CompanyTypesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-edit-company-type',
  templateUrl: './edit-company-type.component.html',
  styleUrls: ['./edit-company-type.component.scss'],
})
export class EditCompanyTypeComponent implements OnInit {
  model: any = {
    parentid: {
      typeid: 0,
    },
  };
  index: number = 0;
  companyId: number = 0;
  typeId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  cmpTypes: any = [];
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
    this.sub = this.route.queryParams.subscribe((params) => {
      this.typeId = +params['a'] || 0;
      console.log('Query params ', this.typeId);
    });
    this.spinner.show();
    this.companyTypesService.getCompanyType(this.typeId).subscribe(
      (response) => {
        this.model = response;
        if (!this.model.parentid) {
          this.model.parentid = {
            typeid: 0,
          };
        } else {
          this.value = this.model.parentid.typeid;
        }
        this.getAllTypes();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllTypes() {
    this.spinner.show();
    this.companyTypesService
      .getAllCompanyTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.cmpTypes = response;
          var self = this;
          if (this.cmpTypes && this.cmpTypes.length > 0) {
            self.items = this.generateHierarchy(this.cmpTypes);
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  generateHierarchy(typeList: any[]) {
    var items: any = [];
    typeList.forEach((type) => {
      var children = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationid})
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

  onValueChange(value: any) {
    console.log(value);
  }

  updateCompanyType() {
    if (
      this.model.name === undefined ||
      this.model.name === '' ||
      this.value == this.typeId
    ) {
      this.index = -1;
      if (this.value == this.typeId) {
        this.index = -2;
      }

      window.scroll(0, 0);
    } else {
      var request = {
        attributesearchdisplay: 0,
        company: {
          companyid: this.companyId,
        },
        description: this.model.description,
        entitytypeid: this.model.entitytypeid,
        hostingfee: this.model.hostingfee,
        ishidden: true,
        lastmodifiedby: this.userName,
        moduleType: 'companytype',
        name: this.model.name,
        parentid: {
          typeid: this.value ? this.value : 0,
        },
        typeList: this.model.typeList,
        typeid: this.typeId,
        typemtbs: 0,
        typespareratio: 0,
        moduletype: 'companytype',
      };
      this.spinner.show();
      this.companyTypesService
        .updateCompanyType(this.typeId, request)
        .subscribe(
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
