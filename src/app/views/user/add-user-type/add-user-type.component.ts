import { Component, OnInit } from '@angular/core';
import { UserTypesService } from '../../../services/user-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user-type',
  templateUrl: './add-user-type.component.html',
  styleUrls: ['./add-user-type.component.scss'],
})
export class AddUserTypeComponent implements OnInit {
  model: any = {
    parentid: {
      typeid: 0,
    },
  };
  index: number = 0;
  companyId: number;
  globalCompany: any = {};
  userTypes: any;
  companyName: any;
  // broadcasterService: any;
  //items: any[];

  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  helpFlag: any = false;
  dismissible = true;

  constructor(
    private userTypesService: UserTypesService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.getAllUserTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllUserTypes() {
    this.spinner.show();
    this.userTypesService
      .getAllUserTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.userTypes = response;
          var self = this;
          if (this.userTypes && this.userTypes.length > 0) {
            self.items = [];

            self.items = this.generateHierarchy(this.userTypes);
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
    this.value = value;
    console.log(value);
  }

  saveUserType() {
    if (this.model.name) {
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
        moduleType: 'usertype',
        name: this.model.name,
        parentid: {
          typeid: this.value ? this.value : 0,
        },
        typeid: 0,
        typemtbs: 0,
        typespareratio: 0,
      };
      this.spinner.show();
      this.userTypesService.saveUserType(request).subscribe(
        (response) => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.router.navigate(['/user/types']);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
