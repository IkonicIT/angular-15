import { Component, OnInit } from '@angular/core';
import { UserTypesService } from '../../../services/user-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-edit-user-type',
  templateUrl: './edit-user-type.component.html',
  styleUrls: ['./edit-user-type.component.scss'],
})
export class EditUserTypeComponent implements OnInit {
  model: any = {
    parentId: {
      typeId: 0,
    },
  };
  userTypeId: any;
  index: number;
  companyId: any;
  globalCompany: any;
  companyName: any;
  userTypes: any;
  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private userTypesService: UserTypesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.userTypeId = route.snapshot.params['id'];
    this.companyId = route.snapshot.params['cmpId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
    this.getAllUserTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getUserType(typeId: any) {
    this.spinner.show();

    this.userTypesService.getUserTypeDetails(typeId).subscribe((response) => {
      this.spinner.hide();

      console.log(response);
      this.model = response;
      if (!this.model.parentId) {
        this.model.parentId = {
          typeId: 0,
        };
      } else {
        this.value = this.model.parentId.typeId;
      }
    });
  }

  getAllUserTypes() {
    this.userTypesService
      .getAllUserTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.userTypes = response;
          var self = this;
          if (this.userTypes && this.userTypes.length > 0) {
            self.items = this.generateHierarchy(this.userTypes);
          }
          this.getUserType(this.userTypeId);
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
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationId})
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  updateUserType() {
    if (this.model.name && this.model.parentId.typeId != this.userTypeId) {
      var request = {
        attributeSearchDisplay: 0,
        description: this.model.description,
        entityTypeId: this.model.entitytypeId,
        hostingFee: this.model.hostingFee,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'usertype',
        name: this.model.name,
        parentId: {
          typeId: this.model.parentId.typeId ? this.model.parentId.typeId : 0,
        },
        company: {
          companyId: this.companyId,
        },
        typeList: this.model.typeList,
        typeId: this.userTypeId,
        typeMtbs: 0,
        typeSpareRatio: 0,
      };
      this.spinner.show();

      this.userTypesService.updateUserType(request).subscribe(
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
      if (this.model.parentId.typeId == this.userTypeId) {
        this.index = -2;
      }
      window.scroll(0, 0);
    }
  }
  getAllUserTypesWithHierarchy() {
    this.spinner.show();

    this.userTypesService
      .getAllUserTypesWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.spinner.hide();

        this.broadcasterService.userTypeHierarchy = response;
      });
  }
  onValueChange(value: any) {
    this.value = value;
    console.log(value);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
