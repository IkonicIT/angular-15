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
    parentId: { typeId: 0 },
  };

  index = 0;
  companyId = 0;
  globalCompany: any = {};
  userTypes: any;
  companyName = '';
  value: number | null = null;
  items: TreeviewItem[] = [];
  config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });

  userName: string | null = null;
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private userTypesService: UserTypesService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.companyName = this.globalCompany.name;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.getAllUserTypes();
  }

  getAllUserTypes(): void {
    this.spinner.show();
    this.userTypesService.getAllUserTypesWithHierarchy(this.companyId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.userTypes = response;
        if (this.userTypes && this.userTypes.length > 0) {
          this.items = this.generateHierarchy(this.userTypes);
        }
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  generateHierarchy(typeList:any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    typeList.forEach((type) => {
<<<<<<< HEAD
      const children = type.typeList && type.typeList.length > 0
        ? this.generateHierarchy(type.typeList)
        : [];
=======
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationId})
      }
>>>>>>> 73e99df05c6bfebbd0fbd624d8715b0e0601450c
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children,
        })
      );
    });
    return items;
  }

  onValueChange(value: number): void {
    this.value = value;
    console.log(value);
  }

  saveUserType(): void {
    if (this.model.name) {
      const request = {
        attributeSearchDisplay: 0,
        company: { companyId: this.companyId },
        description: this.model.description,
        entityTypeId: 0,
        hostingFee: this.model.hostingFee ? this.model.hostingFee : 0,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'usertype',
        name: this.model.name,
        parentId: { typeId: this.value ? this.value : 0 },
        typeId: 0,
        typeMtbs: 0,
        typeSpareRatio: 0,
      };

      this.spinner.show();
      this.userTypesService.saveUserType(request).subscribe({
        next: () => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.router.navigate(['/user/types']);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
