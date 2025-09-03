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
  userTypeId!: number;
  index = 0;
  companyId!: number;
  globalCompany: any;
  companyName = '';
  userTypes: any[] = [];
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
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.userTypeId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyId = Number(this.route.snapshot.paramMap.get('cmpId'));

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany?.name ?? '';

    this.companyManagementService.globalCompanyChange.subscribe((value: any) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });

    this.getAllUserTypes();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  getUserType(typeId: number): void {
    this.spinner.show();
    this.userTypesService.getUserTypeDetails(typeId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.model = response;
        if (!this.model.parentId) {
          this.model.parentId = { typeId: 0 };
        } else {
          this.value = this.model.parentId.typeId;
        }
      },
      error: () => this.spinner.hide(),

    });
  }

  getAllUserTypes(): void {
    this.userTypesService.getAllUserTypesWithHierarchy(this.companyId).subscribe({
      next: (response: any[]) => {
        this.userTypes = response;
        if (this.userTypes?.length > 0) {
          this.items = this.generateHierarchy(this.userTypes);
        }
        this.getUserType(this.userTypeId);
      },
      error: () => this.spinner.hide(),
    });
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchy(type.typeList)
          : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  updateUserType(): void {
    if (this.model.name && this.model.parentId.typeId !== this.userTypeId) {
      const request = {
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
      this.userTypesService.updateUserType(request).subscribe({
        next: () => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.router.navigate(['/user/types']);
        },
        error: () => this.spinner.hide(),
      });
    } else {
      this.index = -1;
      if (this.model.parentId.typeId === this.userTypeId) {
        this.index = -2;
      }
      window.scroll(0, 0);
    }
  }

  getAllUserTypesWithHierarchy(): void {
    this.spinner.show();
    this.userTypesService.getAllUserTypesWithHierarchy(this.companyId).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.broadcasterService.userTypeHierarchy = response;
      },
      error: () => this.spinner.hide(),
    });
  }

  onValueChange(value: number): void {
    this.value = value;
    console.log(value);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
